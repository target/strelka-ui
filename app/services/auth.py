import imp
import ldap3
import os
from ldap3 import Server, Connection
from flask import current_app


def check_credentials(username, password):
    if current_app.config["LDAP_URL"]:
        try:

            if os.environ.get("STRELKA_CERT"):
                tls = ldap3.Tls(ca_certs_path=current_app.config["CA_CERT_PATH"])
                ldap_server = ldap3.Server(current_app.config["LDAP_URL"], port=636, tls=tls, use_ssl=True)
            else:
                ldap_server = ldap3.Server(current_app.config["LDAP_URL"], port=636)
            conn = ldap3.Connection(ldap_server, username, password, auto_bind=True)

            conn.search(
                search_base='OU=*,DC=*,DC=*,DC=*',
                search_filter='(sAMAccountName=' + username + ')',
                search_scope='SUBTREE',
                attributes=['AccountName', 'FirstName', 'LastName']
            )

            result = conn.response

            if result:
                return True, {
                    "user_cn": str(result[0]['attributes']._store["AccountName"]),
                    "first_name": str(result[0]['attributes']._store["FirstName"]),
                    "last_name": str(result[0]['attributes']._store["LastName"]),
                }

            current_app.logger.info("login failure for %s: failed to find username", username)
            return False, None

        except ldap3.core.exceptions.LDAPBindError as e:
            current_app.logger.info("login failure for %s: %s", username, e)
            return False, None

        finally:
            if "conn" in locals() and conn.closed is not True:
                conn.unbind()
    else:
        return True, {
            "user_cn": username,
            "first_name": "local",
            "last_name": "local"
        }
