import datetime
from dateutil import parser as date_parser
import logging


def check_mime_type(strelka_data: dict) -> str:
    """
    Checks if the file extension matches the expected extension for its MIME type.
    Skips the check if the file does not have an extension.

    Parameters:
        strelka_data (dict): Strelka file response data.

    Returns:
        str: Insight message or empty string.
    """
    try:
        file_info = strelka_data.get("file", {})
        file_name = file_info.get("name", "")
        file_extension = (
            file_name.rpartition(".")[2].lower() if "." in file_name else None
        )

        if file_extension:
            mime_type = file_info.get("flavors", {}).get("mime", [None])[0]
            expected_extensions = {
                "application/x-dosexec": ["exe", "dll"],
                "image/bmp": ["bmp"],
                "image/jpeg": ["jpg", "jpeg"],
                "image/png": ["png"],
                "image/gif": ["gif"],
                "text/html": ["html", "htm"],
                "text/plain": ["txt"],
                "application/pdf": ["pdf"],
                "application/msword": ["doc"],
                "application/vnd.ms-excel": ["xls"],
                "application/vnd.ms-powerpoint": ["ppt"],
                "application/zip": ["zip"],
                "application/x-rar-compressed": ["rar"],
                "application/x-tar": ["tar"],
                "application/x-7z-compressed": ["7z"],
                "application/x-bzip2": ["bz2"],
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
                    "docx"
                ],
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
                    "xlsx"
                ],
                "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
                    "pptx"
                ],
                "audio/mpeg": ["mp3"],
                "audio/ogg": ["ogg"],
                "video/mp4": ["mp4"],
                "video/mpeg": ["mpeg", "mpg"],
                "application/javascript": ["js"],
                "application/json": ["json"],
                "application/xml": ["xml"],
                "application/x-shockwave-flash": ["swf"],
                "application/x-msdownload": ["exe", "msi"],
                "application/x-font-ttf": ["ttf"],
                "font/otf": ["otf"],
                "application/x-font-woff": ["woff"],
                "application/x-font-woff2": ["woff2"],
            }
            if (
                mime_type in expected_extensions
                and file_extension not in expected_extensions[mime_type]
            ):
                return f"The file extension .{file_extension} does not match the expected extension for its MIME type ({mime_type})."

        return ""
    except Exception as e:
        logging.warning(f"Error in MIME type check: {e}")
    return ""


def check_entropy(strelka_data: dict) -> str:
    """
    Checks if the file has high entropy, which may indicate encryption or packing.

    Parameters:
        strelka_data (dict): Strelka file response data.

    Returns:
        str: Insight message or empty string.
    """
    try:
        if (
            "entropy" in strelka_data["scan"]
            and strelka_data["scan"]["entropy"]["entropy"] > 7
        ):
            return "The file has an entropy value greater than 7, which may indicate encryption or packing."
    except Exception as e:
        logging.warning(f"Error in entropy check: {e}")
    return ""


def check_virustotal(strelka_data: dict) -> str:
    """
    Checks the number of VirusTotal detections.

    Parameters:
        strelka_data (dict): Strelka file response data.

    Returns:
        str: Insight message or empty string.
    """
    try:
        if (
            "virustotal" in strelka_data.get("enrichment", {})
            and strelka_data["enrichment"]["virustotal"] > 5
        ):
            return f"The file has been flagged by {strelka_data['enrichment']['virustotal']} VirusTotal detections."
    except Exception as e:
        logging.warning(f"Error in VirusTotal check: {e}")
    return ""


def check_yara_matches(strelka_data: dict) -> str:
    """
    Checks for a significant number of YARA matches.

    Parameters:
        strelka_data (dict): Strelka file response data.

    Returns:
        str: Insight message or empty string.
    """
    try:
        if (
            "yara" in strelka_data["scan"]
            and "matches" in strelka_data["scan"]["yara"]
            and len(strelka_data["scan"]["yara"]["matches"]) > 5
        ):
            return f"The file has a significant number of YARA matches ({len(strelka_data['scan']['yara']['matches'])})."
    except Exception as e:
        logging.warning(f"Error in YARA matches check: {e}")
    return ""


def check_suspicious_yara_rules(strelka_data: dict) -> str:
    """
    Checks for the presence of suspicious YARA rules.

    Parameters:
        strelka_data (dict): Strelka file response data.

    Returns:
        str: Insight message or empty string.
    """
    suspicious_yara_rules = ["autoopen", "screenshot", "maldoc", "exploit"]
    try:
        if (
            "yara" in strelka_data["scan"]
            and "matches" in strelka_data["scan"]["yara"]
            and any(
                match.lower() in [rule.lower() for rule in suspicious_yara_rules]
                for match in strelka_data["scan"]["yara"]["matches"]
            )
        ):
            return "Suspicious YARA rules detected that may indicate malicious features such as auto-opening or screenshot capturing."
    except Exception as e:
        logging.warning(f"Error in suspicious YARA rules check: {e}")
    return ""


def check_pe_file_signing(strelka_data: dict) -> str:
    """
    Checks if the PE file is digitally signed.

    Parameters:
        strelka_data (dict): Strelka file response data.

    Returns:
        str: Insight message or empty string.
    """
    try:
        pe_data = strelka_data["scan"].get("pe", {})
        if pe_data and "flags" in pe_data and not "signed" in pe_data["flags"]:
            return "The PE file is not digitally signed."
    except Exception as e:
        logging.warning(f"Error in PE file signing check: {e}")
    return ""


def check_pe_high_entropy_sections(strelka_data: dict) -> str:
    """
    Checks if any section of the PE file has high entropy.

    Parameters:
        strelka_data (dict): Strelka file response data.

    Returns:
        str: Insight message or empty string.
    """
    try:
        pe_data = strelka_data["scan"].get("pe", {})
        if pe_data and any(
            section.get("entropy", 0) > 7 for section in pe_data.get("sections", [])
        ):
            return "One or more sections of the PE file have high entropy, indicating potential packing or encryption."
    except Exception as e:
        logging.warning(f"Error in PE high entropy sections check: {e}")
    return ""


def check_pe_compile_time(strelka_data: dict) -> str:
    """
    Checks if the PE file has a future or suspiciously specific compile time.

    Parameters:
        strelka_data (dict): Strelka file response data.

    Returns:
        str: Insight message or empty string.
    """
    try:
        pe_data = strelka_data["scan"].get("pe", {})
        if pe_data and "compile_time" in pe_data:
            compile_time_str = pe_data["compile_time"]
            compile_time = date_parser.parse(compile_time_str)

            # Check for future compile time
            if compile_time > datetime.datetime.now():
                return "The PE file has a future compile time, which may be indicative of tampering."

            # Define criteria for obviously stomped compile times
            unix_epoch_start = datetime.datetime(1970, 1, 1)
            some_ancient_date = datetime.datetime(1990, 1, 1)
            if compile_time == unix_epoch_start or compile_time < some_ancient_date:
                return "The PE file has a suspiciously specific or ancient compile time, which may be indicative of tampering."

    except Exception as e:
        logging.warning(f"Error in PE compile time check: {e}")
    return ""


def check_pe_suspicious_imports(strelka_data: dict) -> str:
    """
    Checks for suspicious imports commonly used in malware.

    Parameters:
        strelka_data (dict): Strelka file response data.

    Returns:
        str: Insight message or empty string.
    """
    suspicious_imports = [
        "CreateRemoteThread",
        "CreateProcess",
        "WinExec",
        "ShellExecute",
        "HttpSendRequest",
        "InternetReadFile",
        "VirtualProtectEx",
        "VirtualAllocEx",
        "WriteProcessMemory",
        "ReadProcessMemory",
        "SetWindowsHookEx",
        "RegisterHotKey",
        "GetAsyncKeyState",
        "SetThreadContext",
        "ResumeThread",
        "LoadLibrary",
        "GetProcAddress",
    ]
    try:
        pe_data = strelka_data["scan"].get("pe", {})
        if pe_data and any(
            imp in suspicious_imports for imp in pe_data.get("imported", [])
        ):
            return "Suspicious imports detected that are commonly used in malware."
    except Exception as e:
        logging.warning(f"Error in PE suspicious imports check: {e}")
    return ""


def check_pe_unusual_sections_count(strelka_data: dict) -> str:
    """
    Checks if the PE file has an unusual number of sections.

    Parameters:
        strelka_data (dict): Strelka file response data.

    Returns:
        str: Insight message or empty string.
    """
    try:
        pe_data = strelka_data["scan"].get("pe", {})
        if pe_data and len(pe_data.get("sections", [])) > 10:
            return (
                "An unusual number of sections detected in the PE file, which could indicate modifications to hide "
                "malicious content."
            )
    except Exception as e:
        logging.warning(f"Error in PE unusual sections count check: {e}")
    return ""


def get_insights(strelka_data: dict) -> set:
    """
    Aggregates various potential insights from a Strelka file response.

    Parameters:
        strelka_data (dict): Strelka file response data.

    Returns:
        set: Set of insights.
    """
    insights = set()

    # Perform Insight Collection
    insights.add(check_mime_type(strelka_data))
    insights.add(check_entropy(strelka_data))
    insights.add(check_virustotal(strelka_data))
    insights.add(check_yara_matches(strelka_data))
    insights.add(check_suspicious_yara_rules(strelka_data))
    insights.add(check_pe_file_signing(strelka_data))
    insights.add(check_pe_high_entropy_sections(strelka_data))
    insights.add(check_pe_compile_time(strelka_data))
    insights.add(check_pe_suspicious_imports(strelka_data))
    insights.add(check_pe_unusual_sections_count(strelka_data))

    # Remove empty strings from insights
    return {insight for insight in insights if insight}
