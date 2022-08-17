const results = [
    {
        "_index": "strelka-2021.01-000005",
        "_type": "_doc",
        "_id": "o8U0NHkBY9evrCxwIRRD",
        "_version": 1,
        "_score": null,
        "_ignored": [
          "log.offset"
        ],
        "_source": {
          "scan_entropy": {
            "elapsed": 0.000071,
            "entropy": 6.386615448910441
          },
          "request": {
            "source": "4703687471562752-1b8d03c651f637fc49cdf29dbd22ca08-237902023094665c3b3e95896af8dd6ebbcfe4dc1b3841c6894e5809c6721411-1619986164",
            "time": 1620078276,
            "client": "elastalert",
            "id": "1af31507-a9ef-4223-86fd-6f8645ddcd4f",
            "attributes": {
              "filename": "524a4cde5b5df4b2fc19ce9052d6e8c7",
              "metadata": {
                "rule_name": "VTN with ephemeral_download_link",
                "archive_location": "swift",
                "alert_index": "vt_notifications",
                "archive_file": "elastalert/vtn/identification_rules_ke/docx_template_injection/application/zip/524a4cde5b5df4b2fc19ce9052d6e8c7",
                "full_url": "https://www.virustotal.com/vtapi/v2/file/feed/download?token=OTRjZmJlN2M4MmM0YjZhZGExNTY0YzVhMTQ3NzU3MmYwZWU5Zjg3MTNkMzdlNWNlYmYyM2IwZTc5MDdhNTk0Ynx8MjM3OTAyMDIzMDk0NjY1YzNiM2U5NTg5NmFmOGRkNmViYmNmZTRkYzFiMzg0MWM2ODk0ZTU4MDljNjcyMTQxMXx8MTYxOTk5MzQ3Nnx8NjZlNjlkMDdkMTJlMzE2N2FjYWJjNTIxZjMwM2MyZDg2Zjc5Y2U5MjM5OWJlMDU2Y2FiNjAzNGU1YTAxYmE0YQ",
                "rule_author": "Mike Pananen",
                "rule_description": "Rule that fires on all vt_notifications with ephemeral_download_link"
              }
            }
          },
          "@timestamp": "2021-05-03T21:48:21.103Z",
          "file": {
            "flavors": {
              "mime": [
                "image/png"
              ],
              "yara": [
                "png_file"
              ]
            },
            "tree": {
              "parent": "962b366b-a839-47df-b2b7-c0d1176ca52c",
              "node": "df1a1705-7ec5-478c-a51e-6fe33b0c97c3"
            },
            "size": 1040,
            "scanner_list": [
              "ScanEntropy",
              "ScanHash",
              "ScanHeader",
              "ScanOcr",
              "ScanYara"
            ],
            "name": "res/drawable-xxhdpi/ic_cancel_black_24dp.png",
            "source": "ScanZip",
            "depth": 1
          },
          "log": {
            "offset": 182440556644,
            "file": {
              "path": "/strelka.log"
            }
          },
          "scan_ocr": {
            "elapsed": 0.207498
          },
          "ecs": {
            "version": "1.1.0"
          },
          "scan_yara": {
            "matches": [
              "dummy",
              "re_png_mime"
            ],
            "meta": [
              {
                "value": "Paul Hutelmyer",
                "identifier": "author",
                "rule": "dummy"
              },
              {
                "value": "04/09/2021",
                "identifier": "date",
                "rule": "dummy"
              },
              {
                "value": "white",
                "identifier": "tlp",
                "rule": "re_png_mime"
              },
              {
                "value": "Ryan Borre",
                "identifier": "author",
                "rule": "re_png_mime"
              },
              {
                "value": "11/08/2019",
                "rule": "re_png_mime",
                "identifier": "date"
              },
              {
                "value": "['informational']",
                "identifier": "scope",
                "rule": "re_png_mime"
              }
            ],
            "elapsed": 0.08427,
            "tags": [
              "image"
            ]
          },
          "tags": [
            "strelka",
            "beats_input_raw_event"
          ],
          "scan_header": {
            "elapsed": 0.000055,
            "header": "�PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000H\u0000\u0000\u0000H\b\u0003\u0000\u0000\u0000b3Cu\u0000\u0000\u0001\bPLTE\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000"
          },
          "scan_hash": {
            "md5": "707ab7250d86a1de24ddccfaa18e3dd4",
            "sha256": "575825c8a72e414329f1cecc37a59c723ffba5ba6940abe4d3c928ce0c664d5f",
            "elapsed": 0.000161,
            "sha1": "0aa108c37467f2b166bf38a59ad9f61606f9ed5e",
            "ssdeep": "24:gbub4qCDG5IQAG7ukjS6rrInCPb5Ccmpk:gy+qdLCEHRPVM+"
          },
          "host": {
            "name": "8ea04ea7b4a9"
          },
          "input": {
            "type": "log"
          },
          "@version": "1",
          "agent": {
            "ephemeral_id": "a8eb8c1f-b395-4b10-8251-a321e099f9df",
            "version": "7.5.0",
            "hostname": "8ea04ea7b4a9",
            "type": "filebeat",
            "id": "09f9626f-4a90-4d1a-ade0-3bbcfcf2b9e1"
          },
          "scan_zip": {
            "elapsed": 3.361097,
            "total": {
              "extracted": 1000,
              "files": 1518
            }
          }
        },
        "fields": {
          "@timestamp": [
            "2021-05-03T21:48:21.103Z"
          ],
          "request.time": [
            "2021-05-03T21:44:36.000Z"
          ]
        },
        "sort": [
          1620078501103
        ]
      },
      {
        "_index": "strelka-2021.01-000005",
        "_type": "_doc",
        "_id": "oMUzNHkBY9evrCxw_gcH",
        "_version": 1,
        "_score": null,
        "_ignored": [
          "log.offset"
        ],
        "_source": {
          "scan_entropy": {
            "elapsed": 0.000113,
            "entropy": 3.937855598016164
          },
          "request": {
            "source": "4703687471562752-1b8d03c651f637fc49cdf29dbd22ca08-237902023094665c3b3e95896af8dd6ebbcfe4dc1b3841c6894e5809c6721411-1619986164",
            "time": 1620078276,
            "client": "elastalert",
            "id": "1af31507-a9ef-4223-86fd-6f8645ddcd4f",
            "attributes": {
              "filename": "524a4cde5b5df4b2fc19ce9052d6e8c7",
              "metadata": {
                "archive_location": "swift",
                "rule_name": "VTN with ephemeral_download_link",
                "alert_index": "vt_notifications",
                "archive_file": "elastalert/vtn/identification_rules_ke/docx_template_injection/application/zip/524a4cde5b5df4b2fc19ce9052d6e8c7",
                "full_url": "https://www.virustotal.com/vtapi/v2/file/feed/download?token=OTRjZmJlN2M4MmM0YjZhZGExNTY0YzVhMTQ3NzU3MmYwZWU5Zjg3MTNkMzdlNWNlYmYyM2IwZTc5MDdhNTk0Ynx8MjM3OTAyMDIzMDk0NjY1YzNiM2U5NTg5NmFmOGRkNmViYmNmZTRkYzFiMzg0MWM2ODk0ZTU4MDljNjcyMTQxMXx8MTYxOTk5MzQ3Nnx8NjZlNjlkMDdkMTJlMzE2N2FjYWJjNTIxZjMwM2MyZDg2Zjc5Y2U5MjM5OWJlMDU2Y2FiNjAzNGU1YTAxYmE0YQ",
                "rule_author": "Mike Pananen",
                "rule_description": "Rule that fires on all vt_notifications with ephemeral_download_link"
              }
            }
          },
          "@timestamp": "2021-05-03T21:48:12.084Z",
          "file": {
            "flavors": {
              "mime": [
                "image/png"
              ],
              "yara": [
                "png_file"
              ]
            },
            "tree": {
              "parent": "962b366b-a839-47df-b2b7-c0d1176ca52c",
              "node": "f272b6e2-6ec6-4a25-b782-cc385b402614"
            },
            "size": 216,
            "scanner_list": [
              "ScanEntropy",
              "ScanHash",
              "ScanHeader",
              "ScanOcr",
              "ScanYara"
            ],
            "name": "res/drawable-xxhdpi/abc_textfield_activated_mtrl_alpha.9.png",
            "source": "ScanZip",
            "depth": 1
          },
          "log": {
            "offset": 182440468681,
            "file": {
              "path": "/strelka.log"
            }
          },
          "scan_ocr": {
            "elapsed": 0.168242
          },
          "ecs": {
            "version": "1.1.0"
          },
          "tags": [
            "strelka",
            "beats_input_raw_event"
          ],
          "scan_yara": {
            "matches": [
              "dummy",
              "re_png_mime"
            ],
            "meta": [
              {
                "value": "Paul Hutelmyer",
                "identifier": "author",
                "rule": "dummy"
              },
              {
                "value": "04/09/2021",
                "identifier": "date",
                "rule": "dummy"
              },
              {
                "value": "white",
                "identifier": "tlp",
                "rule": "re_png_mime"
              },
              {
                "value": "Ryan Borre",
                "identifier": "author",
                "rule": "re_png_mime"
              },
              {
                "value": "11/08/2019",
                "identifier": "date",
                "rule": "re_png_mime"
              },
              {
                "value": "['informational']",
                "rule": "re_png_mime",
                "identifier": "scope"
              }
            ],
            "elapsed": 0.087305,
            "tags": [
              "image"
            ]
          },
          "scan_header": {
            "elapsed": 0.000063,
            "header": "�PNG\r\n\u001a\n\u0000\u0000\u0000\rIHDR\u0000\u0000\u0000&\u0000\u0000\u0000!\b\u0003\u0000\u0000\u0000��)$\u0000\u0000\u0000\u0018npOl\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000"
          },
          "scan_hash": {
            "md5": "b906d092c3238fca4874d567b2612d1f",
            "sha256": "99108fbd0233baac062fb41ecea972ed1c4e183b732014107c4803bfc5d73295",
            "elapsed": 0.000227,
            "sha1": "6bb1adc6c26947cb7140f57b385ae6a7f0ab37b6",
            "ssdeep": "3:yionv//thPlhdl9DAyltYtJVAlnfF//ll3lurpmX/cqlCQhl/O7OgGFBuHB6VkVp:6v/lhPVfqtJilusDlh47ODTuh6mp"
          },
          "host": {
            "name": "8ea04ea7b4a9"
          },
          "input": {
            "type": "log"
          },
          "@version": "1",
          "agent": {
            "ephemeral_id": "a8eb8c1f-b395-4b10-8251-a321e099f9df",
            "version": "7.5.0",
            "hostname": "8ea04ea7b4a9",
            "type": "filebeat",
            "id": "09f9626f-4a90-4d1a-ade0-3bbcfcf2b9e1"
          },
          "scan_zip": {
            "elapsed": 3.361097,
            "total": {
              "extracted": 1000,
              "files": 1518
            }
          }
        },
        "fields": {
          "@timestamp": [
            "2021-05-03T21:48:12.084Z"
          ],
          "request.time": [
            "2021-05-03T21:44:36.000Z"
          ]
        },
        "sort": [
          1620078492084
        ]
      },
      {
        _index: "strelka-2021.01-000005",
        _type: "_doc",
        _id: "2sU1NHkBY9evrCxwNnTw",
        _version: 1,
        _score: null,
        _ignored: ["log.offset"],
        _source: {
          scan_entropy: {
            elapsed: 0.000232,
            entropy: 4.976454076725498,
          },
          request: {
            time: 1620078568,
            client: "ralph",
            source: "ralph",
            attributes: {
              filename: "SAkZyqd0",
              metadata: {
                swift_url:
                  "https://openstack.redspace.carpecloud.net:7480/swift/v1/ralph/SAkZyqd0",
                date: "2021-05-03T21:44:02Z",
                scrape_url:
                  "https://scrape.pastebin.com/api_scrape_item.php?i=SAkZyqd0",
                size: "47977",
                key: "SAkZyqd0",
                syntax: "text",
                full_url: "https://pastebin.com/SAkZyqd0",
              },
            },
            id: "f7b09196-ea0c-4ea1-af2c-166735dcf77f",
          },
          "@timestamp": "2021-05-03T21:49:32.182Z",
          file: {
            flavors: {
              mime: ["text/plain"],
            },
            tree: {
              node: "650fdebf-bcf0-460d-b44e-07cd5c5b9729",
            },
            size: 47977,
            scanner_list: ["ScanEntropy", "ScanHash", "ScanHeader", "ScanYara"],
            depth: 0,
          },
          log: {
            offset: 182440882786,
            file: {
              path: "/strelka.log",
            },
          },
          scan_hash: {
            md5: "cda493d8f6e639b63c45e3caa7dbf741",
            sha256:
              "2c4dd9ea2e362e0f34d0ea34e6d16b647f467371e643e7064b6f589e1bb40204",
            elapsed: 0.001103,
            sha1: "32a5bdbfe15ae19a1ff0b8f478ca4d768aa70f77",
            ssdeep:
              "384:I8bOwafrkacMAPbOwafrkaVYOMvYuvOatqmW3VH4vPbSahK7CqckLj9L3t:qrkacIrkaVYOGkmk4v2a81t",
          },
          ecs: {
            version: "1.1.0",
          },
          host: {
            name: "8ea04ea7b4a9",
          },
          scan_header: {
            elapsed: 0.000055,
            header: "---- Minecraft Crash Report ----\r\n// Don't do that",
          },
          scan_yara: {
            matches: ["dummy", "re_plain_mime"],
            meta: [
              {
                value: "Paul Hutelmyer",
                identifier: "author",
                rule: "dummy",
              },
              {
                value: "04/09/2021",
                identifier: "date",
                rule: "dummy",
              },
              {
                value: "white",
                identifier: "tlp",
                rule: "re_plain_mime",
              },
              {
                value: "Ryan Borre",
                identifier: "author",
                rule: "re_plain_mime",
              },
              {
                value: "06/18/2019",
                identifier: "date",
                rule: "re_plain_mime",
              },
              {
                value: "['informational']",
                rule: "re_plain_mime",
                identifier: "scope",
              },
            ],
            elapsed: 0.091092,
            tags: ["image"],
          },
          tags: ["strelka", "beats_input_raw_event"],
          input: {
            type: "log",
          },
          "@version": "1",
          agent: {
            ephemeral_id: "a8eb8c1f-b395-4b10-8251-a321e099f9df",
            version: "7.5.0",
            hostname: "8ea04ea7b4a9",
            type: "filebeat",
            id: "09f9626f-4a90-4d1a-ade0-3bbcfcf2b9e1",
          },
        },
        fields: {
          "@timestamp": ["2021-05-03T21:49:32.182Z"],
          "request.time": ["2021-05-03T21:49:28.000Z"],
        },
        sort: [1620078572182],
      },
]

export { results }