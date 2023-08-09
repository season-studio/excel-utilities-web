import { ActionFlowEngine } from "./ActionFlowEngine";
import { ActionResult } from "./dataTypes/actionResult";
import actionCollection from "./actionCollection";

const predefinedFunctions = [
    {
        "title": "物料需求展开",
        "steps": [
            {
                "action": "getTableFromClipboard",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-116e998d891941b2810d19b34bb732e9",
                "arguments": [
                    {
                        "value": "输入“半成品-半成品”表格"
                    }
                ],
                "comment": "“半成品-半成品”表格"
            },
            {
                "action": "createObject",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-3cf12e0956b044b0ab98273b07cc975c",
                "arguments": [],
                "comment": "“半成品-成品”的需求关系缓存"
            },
            {
                "action": "showTip",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-0b4d4eb408444dcdbed3157a893bb8e8",
                "arguments": [
                    {
                        "value": "分析中，请稍后"
                    },
                    {
                        "value": "wait"
                    },
                    {
                        "value": true
                    }
                ]
            },
            {
                "action": "loopForTableRow",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-07a44885ac3a4fdea74259bae068eb01",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-116e998d891941b2810d19b34bb732e9"
                        }
                    },
                    {
                        "value": 0
                    }
                ],
                "relationStep": [
                    "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-c4b9fa9e62b74c819f38a07c29f11ae5"
                ],
                "comment": "遍历“半成品-半成品”表格的每一行"
            },
            {
                "action": "getArrayElement",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7c169000472749ebae3df85d4f00821e",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-07a44885ac3a4fdea74259bae068eb01"
                        }
                    },
                    {
                        "value": 0
                    }
                ],
                "comment": "1级半成品的料号"
            },
            {
                "action": "getArrayElement",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-ab80cd5670df42aba425722a75edbb2f",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-07a44885ac3a4fdea74259bae068eb01"
                        }
                    },
                    {
                        "value": 1
                    }
                ],
                "comment": "1级半成品的名称"
            },
            {
                "action": "getArrayElement",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7f5f8c12cf254619bdd1ea95914a6d44",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-07a44885ac3a4fdea74259bae068eb01"
                        }
                    },
                    {
                        "value": 3
                    }
                ],
                "comment": "2级半成品的料号"
            },
            {
                "action": "getArrayElement",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-33f4a7ba4ed44dbabc039dee663615ab",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-07a44885ac3a4fdea74259bae068eb01"
                        }
                    },
                    {
                        "value": 4
                    }
                ],
                "comment": "2级半成品的名称"
            },
            {
                "action": "getArrayElement",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-b1d831d49ae64e7bbacd0f73e9737cea",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-07a44885ac3a4fdea74259bae068eb01"
                        }
                    },
                    {
                        "value": 6
                    }
                ],
                "comment": "1级半成品对2级半成品的需求量"
            },
            {
                "action": "getObjectItemWithDefault",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-42c32eaa54544e5b86a7f807bb37edf0",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-3cf12e0956b044b0ab98273b07cc975c"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7c169000472749ebae3df85d4f00821e"
                        }
                    },
                    {
                        "value": {}
                    }
                ],
                "comment": "关系缓存中1级半成品的信息集合"
            },
            {
                "action": "setObjectItem",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-5e4840441b7c4f7185607ad54f88e288",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-42c32eaa54544e5b86a7f807bb37edf0"
                        }
                    },
                    {
                        "value": "name"
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-ab80cd5670df42aba425722a75edbb2f"
                        }
                    }
                ]
            },
            {
                "action": "getObjectItemWithDefault",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-ac2d5ff413ad4538b5b7a400019e260a",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-42c32eaa54544e5b86a7f807bb37edf0"
                        }
                    },
                    {
                        "value": "subitems"
                    },
                    {
                        "value": {}
                    }
                ],
                "comment": "1级半成品下的2级半成品的集合缓存"
            },
            {
                "action": "getObjectItemWithDefault",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-959fcb82ee91476f9da928c6bdf3529b",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-ac2d5ff413ad4538b5b7a400019e260a"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7f5f8c12cf254619bdd1ea95914a6d44"
                        }
                    },
                    {
                        "value": {}
                    }
                ],
                "comment": "当前2级半成品的信息集合缓存"
            },
            {
                "action": "setObjectItem",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-07bd48aba19c49d6a1bf32251ff2d1a7",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-959fcb82ee91476f9da928c6bdf3529b"
                        }
                    },
                    {
                        "value": "name"
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-33f4a7ba4ed44dbabc039dee663615ab"
                        }
                    }
                ]
            },
            {
                "action": "setObjectItem",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-5d3a68dced954e4185b7751803363693",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-959fcb82ee91476f9da928c6bdf3529b"
                        }
                    },
                    {
                        "value": "need"
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-b1d831d49ae64e7bbacd0f73e9737cea"
                        }
                    }
                ]
            },
            {
                "action": "loopNext",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-c4b9fa9e62b74c819f38a07c29f11ae5",
                "arguments": [],
                "relationStep": [
                    "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-07a44885ac3a4fdea74259bae068eb01"
                ]
            },
            {
                "action": "getTableFromClipboard",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-f17d3ac1cf1847a7b150f33021fa4594",
                "arguments": [
                    {
                        "value": "请输入“成品-半成品”表格"
                    }
                ],
                "comment": "“成品-半成品”表格"
            },
            {
                "action": "showTip",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-73e354b83f4f4bef8389da29d901f403",
                "arguments": [
                    {
                        "value": "正在分析“成品”-“半成品”的需求展开，请稍后"
                    },
                    {
                        "value": "wait"
                    },
                    {
                        "value": true
                    }
                ]
            },
            {
                "action": "createTable",
                "id": "4335b6ce-6010-4484-b3b7-1d9d5ff31676-S-bcc1a647c5b44ce19d6f976a7d790acd",
                "arguments": [
                    {
                        "value": [
                            [
                                "根料号",
                                "根名称",
                                "子项料号",
                                "子项名称",
                                "子项需求量",
                                "子项级别",
                                "是否有下级子项展开"
                            ]
                        ]
                    }
                ],
                "comment": "成品-物料需求展开表"
            },
            {
                "action": "loopForTableRow",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7cd213ad30504bd2a77a2b98abd50da9",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-f17d3ac1cf1847a7b150f33021fa4594"
                        }
                    },
                    {
                        "value": 0
                    }
                ],
                "relationStep": [
                    "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-625ddbc6711845d9ac852c34e912b9f2"
                ],
                "comment": "遍历“成品-半成品”表格的每一行"
            },
            {
                "action": "getArrayElement",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-b9761cc680d84a16b88db1d2ec6a60bf",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7cd213ad30504bd2a77a2b98abd50da9"
                        }
                    },
                    {
                        "value": 0
                    }
                ],
                "comment": "根料号"
            },
            {
                "action": "getArrayElement",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-3907313f1d47405493d16f6dd844a954",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7cd213ad30504bd2a77a2b98abd50da9"
                        }
                    },
                    {
                        "value": 1
                    }
                ],
                "comment": "根名称"
            },
            {
                "action": "getArrayElement",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-c87c2407a0154807b68019af2ef8ef32",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7cd213ad30504bd2a77a2b98abd50da9"
                        }
                    },
                    {
                        "value": 3
                    }
                ],
                "comment": "1级子项料号"
            },
            {
                "action": "getArrayElement",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-c9f29932e7cd4e0f82a89fdd616d674e",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7cd213ad30504bd2a77a2b98abd50da9"
                        }
                    },
                    {
                        "value": 4
                    }
                ],
                "comment": "1级子项名称"
            },
            {
                "action": "getArrayElement",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7ec50f7db906451583176361b7b8dcd7",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7cd213ad30504bd2a77a2b98abd50da9"
                        }
                    },
                    {
                        "value": 6
                    }
                ],
                "comment": "1级子项需求量"
            },
            {
                "action": "getObjectItem",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-3b2e30685b3942f6a0decb07dd68a5eb",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-3cf12e0956b044b0ab98273b07cc975c"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-c87c2407a0154807b68019af2ef8ef32"
                        }
                    }
                ],
                "comment": "“半成品-半成品”关系缓存中1级子项的信息缓存"
            },
            {
                "action": "getObjectItem",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-3619a7892e5e447b950a391774117aa3",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-3b2e30685b3942f6a0decb07dd68a5eb"
                        }
                    },
                    {
                        "value": "subitems"
                    }
                ],
                "comment": "“半成品-半成品”关系缓存中1级子项的2级子项集合"
            },
            {
                "action": "ifElse",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-080518f304dc414c836f224234201dd2",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-3619a7892e5e447b950a391774117aa3"
                        }
                    },
                    {
                        "value": "有"
                    },
                    {
                        "value": "无"
                    }
                ],
                "comment": "当前的1级子项是否有2级展开"
            },
            {
                "action": "makeupArray",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-58ac2307f113448ea2fe43efc05f31d7",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-b9761cc680d84a16b88db1d2ec6a60bf"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-3907313f1d47405493d16f6dd844a954"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-c87c2407a0154807b68019af2ef8ef32"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-c9f29932e7cd4e0f82a89fdd616d674e"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7ec50f7db906451583176361b7b8dcd7"
                        }
                    },
                    {
                        "value": 1
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-080518f304dc414c836f224234201dd2"
                        }
                    }
                ],
                "comment": "根料号与1级子项的信息行"
            },
            {
                "action": "appendTableRow",
                "id": "4335b6ce-6010-4484-b3b7-1d9d5ff31676-S-a70db16f20fc4d9a9c9f6b648deb1b53",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "4335b6ce-6010-4484-b3b7-1d9d5ff31676-S-bcc1a647c5b44ce19d6f976a7d790acd"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-58ac2307f113448ea2fe43efc05f31d7"
                        }
                    }
                ],
                "comment": "将1级子项行添加到目标表格中"
            },
            {
                "action": "loopForObjectItems",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-72486bb7cd53461bbdec4a27ba38185b",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-3619a7892e5e447b950a391774117aa3"
                        }
                    }
                ],
                "relationStep": [
                    "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-b83c659cc54542beb096c5fe278f790b"
                ],
                "comment": "遍历当前1级子项的所有2级子项"
            },
            {
                "action": "getObjectItem",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-3c14194f16544c51814ac6cc38a49510",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-72486bb7cd53461bbdec4a27ba38185b"
                        }
                    },
                    {
                        "value": "key"
                    }
                ],
                "comment": "2级子项料号"
            },
            {
                "action": "getObjectItem",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-c9d14ecdb8284ee293979848c9d51b34",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-72486bb7cd53461bbdec4a27ba38185b"
                        }
                    },
                    {
                        "value": "value"
                    }
                ],
                "comment": "2级子项信息集合"
            },
            {
                "action": "getObjectItem",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-069f98e4c9754fa186d1da7b329da7ec",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-c9d14ecdb8284ee293979848c9d51b34"
                        }
                    },
                    {
                        "value": "name"
                    }
                ],
                "comment": "2级子项名称"
            },
            {
                "action": "getObjectItem",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-553d551a26f34bc2a0289054d4ea60c4",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-c9d14ecdb8284ee293979848c9d51b34"
                        }
                    },
                    {
                        "value": "need"
                    }
                ],
                "comment": "每个1级子项对2级子项的需求量"
            },
            {
                "action": "mul",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-6bc7438879bf4cb888d2ec6a36f4d80b",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-553d551a26f34bc2a0289054d4ea60c4"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7ec50f7db906451583176361b7b8dcd7"
                        }
                    }
                ],
                "comment": "计算根物料对2级子项的需求量"
            },
            {
                "action": "makeupArray",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-b4e780d462d7488590623d3a3b5e72a5",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-b9761cc680d84a16b88db1d2ec6a60bf"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-3907313f1d47405493d16f6dd844a954"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-3c14194f16544c51814ac6cc38a49510"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-069f98e4c9754fa186d1da7b329da7ec"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-6bc7438879bf4cb888d2ec6a36f4d80b"
                        }
                    },
                    {
                        "value": 2
                    },
                    {
                        "value": "N/A"
                    }
                ],
                "comment": "根物料对2级子项的需求信息行"
            },
            {
                "action": "appendTableRow",
                "id": "4335b6ce-6010-4484-b3b7-1d9d5ff31676-S-06470b39d3a84010b096c873fef60c9e",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "4335b6ce-6010-4484-b3b7-1d9d5ff31676-S-bcc1a647c5b44ce19d6f976a7d790acd"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-b4e780d462d7488590623d3a3b5e72a5"
                        }
                    }
                ],
                "comment": "将2级子项的行插入到表格中"
            },
            {
                "action": "loopNext",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-b83c659cc54542beb096c5fe278f790b",
                "arguments": [],
                "relationStep": [
                    "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-72486bb7cd53461bbdec4a27ba38185b"
                ]
            },
            {
                "action": "loopNext",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-625ddbc6711845d9ac852c34e912b9f2",
                "arguments": [],
                "relationStep": [
                    "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7cd213ad30504bd2a77a2b98abd50da9"
                ]
            },
            {
                "action": "referenceData",
                "id": "4335b6ce-6010-4484-b3b7-1d9d5ff31676-S-1ae9863c32764f93a5dc47325350f787",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "4335b6ce-6010-4484-b3b7-1d9d5ff31676-S-bcc1a647c5b44ce19d6f976a7d790acd"
                        }
                    }
                ],
                "comment": "最终结果"
            }
        ],
        "category": "物料需求",
        "uuid": "4335b6ce-6010-4484-b3b7-1d9d5ff31676"
    },
    {
        "title": "物料排产需求",
        "steps": [
            {
                "action": "getTableFromClipboard",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-116e998d891941b2810d19b34bb732e9",
                "arguments": [
                    {
                        "value": "输入“半成品-半成品”表格"
                    }
                ],
                "comment": "“半成品-半成品”表格"
            },
            {
                "action": "createObject",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-3cf12e0956b044b0ab98273b07cc975c",
                "arguments": [],
                "comment": "“半成品-成品”的需求关系缓存"
            },
            {
                "action": "showTip",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-0b4d4eb408444dcdbed3157a893bb8e8",
                "arguments": [
                    {
                        "value": "分析中，请稍后"
                    },
                    {
                        "value": "wait"
                    },
                    {
                        "value": true
                    }
                ]
            },
            {
                "action": "loopForTableRow",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-07a44885ac3a4fdea74259bae068eb01",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-116e998d891941b2810d19b34bb732e9"
                        }
                    },
                    {
                        "value": 0
                    }
                ],
                "relationStep": [
                    "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-c4b9fa9e62b74c819f38a07c29f11ae5"
                ],
                "comment": "遍历“半成品-半成品”表格的每一行"
            },
            {
                "action": "getArrayElement",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7c169000472749ebae3df85d4f00821e",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-07a44885ac3a4fdea74259bae068eb01"
                        }
                    },
                    {
                        "value": 0
                    }
                ],
                "comment": "1级半成品的料号"
            },
            {
                "action": "getArrayElement",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-ab80cd5670df42aba425722a75edbb2f",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-07a44885ac3a4fdea74259bae068eb01"
                        }
                    },
                    {
                        "value": 1
                    }
                ],
                "comment": "1级半成品的名称"
            },
            {
                "action": "getArrayElement",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7f5f8c12cf254619bdd1ea95914a6d44",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-07a44885ac3a4fdea74259bae068eb01"
                        }
                    },
                    {
                        "value": 3
                    }
                ],
                "comment": "2级半成品的料号"
            },
            {
                "action": "getArrayElement",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-33f4a7ba4ed44dbabc039dee663615ab",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-07a44885ac3a4fdea74259bae068eb01"
                        }
                    },
                    {
                        "value": 4
                    }
                ],
                "comment": "2级半成品的名称"
            },
            {
                "action": "getArrayElement",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-b1d831d49ae64e7bbacd0f73e9737cea",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-07a44885ac3a4fdea74259bae068eb01"
                        }
                    },
                    {
                        "value": 6
                    }
                ],
                "comment": "1级半成品对2级半成品的需求量"
            },
            {
                "action": "getObjectItemWithDefault",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-42c32eaa54544e5b86a7f807bb37edf0",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-3cf12e0956b044b0ab98273b07cc975c"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7c169000472749ebae3df85d4f00821e"
                        }
                    },
                    {
                        "value": {}
                    }
                ],
                "comment": "关系缓存中1级半成品的信息集合"
            },
            {
                "action": "setObjectItem",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-5e4840441b7c4f7185607ad54f88e288",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-42c32eaa54544e5b86a7f807bb37edf0"
                        }
                    },
                    {
                        "value": "name"
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-ab80cd5670df42aba425722a75edbb2f"
                        }
                    }
                ]
            },
            {
                "action": "getObjectItemWithDefault",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-ac2d5ff413ad4538b5b7a400019e260a",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-42c32eaa54544e5b86a7f807bb37edf0"
                        }
                    },
                    {
                        "value": "subitems"
                    },
                    {
                        "value": {}
                    }
                ],
                "comment": "1级半成品下的2级半成品的集合缓存"
            },
            {
                "action": "getObjectItemWithDefault",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-959fcb82ee91476f9da928c6bdf3529b",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-ac2d5ff413ad4538b5b7a400019e260a"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7f5f8c12cf254619bdd1ea95914a6d44"
                        }
                    },
                    {
                        "value": {}
                    }
                ],
                "comment": "当前2级半成品的信息集合缓存"
            },
            {
                "action": "setObjectItem",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-07bd48aba19c49d6a1bf32251ff2d1a7",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-959fcb82ee91476f9da928c6bdf3529b"
                        }
                    },
                    {
                        "value": "name"
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-33f4a7ba4ed44dbabc039dee663615ab"
                        }
                    }
                ]
            },
            {
                "action": "setObjectItem",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-5d3a68dced954e4185b7751803363693",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-959fcb82ee91476f9da928c6bdf3529b"
                        }
                    },
                    {
                        "value": "need"
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-b1d831d49ae64e7bbacd0f73e9737cea"
                        }
                    }
                ]
            },
            {
                "action": "loopNext",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-c4b9fa9e62b74c819f38a07c29f11ae5",
                "arguments": [],
                "relationStep": [
                    "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-07a44885ac3a4fdea74259bae068eb01"
                ]
            },
            {
                "action": "getTableFromClipboard",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-f17d3ac1cf1847a7b150f33021fa4594",
                "arguments": [
                    {
                        "value": "请输入“成品-半成品”表格"
                    }
                ],
                "comment": "“成品-半成品”表格"
            },
            {
                "action": "showTip",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-73e354b83f4f4bef8389da29d901f403",
                "arguments": [
                    {
                        "value": "正在分析“成品”-“半成品”的需求展开，请稍后"
                    },
                    {
                        "value": "wait"
                    },
                    {
                        "value": true
                    }
                ]
            },
            {
                "action": "createObject",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-e40f2dc3e98c4225aef28e16b653f617",
                "arguments": [],
                "comment": "产品-子物料信息集合"
            },
            {
                "action": "loopForTableRow",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7cd213ad30504bd2a77a2b98abd50da9",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-f17d3ac1cf1847a7b150f33021fa4594"
                        }
                    },
                    {
                        "value": 0
                    }
                ],
                "relationStep": [
                    "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-625ddbc6711845d9ac852c34e912b9f2"
                ],
                "comment": "遍历“成品-半成品”表格的每一行"
            },
            {
                "action": "getArrayElement",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-b9761cc680d84a16b88db1d2ec6a60bf",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7cd213ad30504bd2a77a2b98abd50da9"
                        }
                    },
                    {
                        "value": 0
                    }
                ],
                "comment": "根料号"
            },
            {
                "action": "getArrayElement",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-3907313f1d47405493d16f6dd844a954",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7cd213ad30504bd2a77a2b98abd50da9"
                        }
                    },
                    {
                        "value": 1
                    }
                ],
                "comment": "根名称"
            },
            {
                "action": "getArrayElement",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-c87c2407a0154807b68019af2ef8ef32",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7cd213ad30504bd2a77a2b98abd50da9"
                        }
                    },
                    {
                        "value": 3
                    }
                ],
                "comment": "1级子项料号"
            },
            {
                "action": "getArrayElement",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-c9f29932e7cd4e0f82a89fdd616d674e",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7cd213ad30504bd2a77a2b98abd50da9"
                        }
                    },
                    {
                        "value": 4
                    }
                ],
                "comment": "1级子项名称"
            },
            {
                "action": "getArrayElement",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7ec50f7db906451583176361b7b8dcd7",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7cd213ad30504bd2a77a2b98abd50da9"
                        }
                    },
                    {
                        "value": 6
                    }
                ],
                "comment": "1级子项需求量"
            },
            {
                "action": "getObjectItemWithDefault",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-f23608b3fa8d4eceb5911b5e8f4e53ea",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-e40f2dc3e98c4225aef28e16b653f617"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-b9761cc680d84a16b88db1d2ec6a60bf"
                        }
                    },
                    {
                        "value": {}
                    }
                ],
                "comment": "当前根物料信息集"
            },
            {
                "action": "setObjectItem",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-0208c28ace6945f295c2209e3b30109e",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-f23608b3fa8d4eceb5911b5e8f4e53ea"
                        }
                    },
                    {
                        "value": "name"
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-3907313f1d47405493d16f6dd844a954"
                        }
                    }
                ]
            },
            {
                "action": "getObjectItemWithDefault",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-5acdfd734bf14b0f911ab527b2a977c9",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-f23608b3fa8d4eceb5911b5e8f4e53ea"
                        }
                    },
                    {
                        "value": "subitems"
                    },
                    {
                        "value": {}
                    }
                ],
                "comment": "当前根物料的子物料集合"
            },
            {
                "action": "getObjectItemWithDefault",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-7c89715b449d49b28c4c55b4301a68a6",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-5acdfd734bf14b0f911ab527b2a977c9"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-c87c2407a0154807b68019af2ef8ef32"
                        }
                    },
                    {
                        "value": {}
                    }
                ],
                "comment": "当前1级物料的信息集合"
            },
            {
                "action": "setObjectItem",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-8e42ec75998a4e48878c8e989d6e3d08",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-7c89715b449d49b28c4c55b4301a68a6"
                        }
                    },
                    {
                        "value": "name"
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-c9f29932e7cd4e0f82a89fdd616d674e"
                        }
                    }
                ]
            },
            {
                "action": "setObjectItem",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-89c8db0ef8594b63b0ef78722f963813",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-7c89715b449d49b28c4c55b4301a68a6"
                        }
                    },
                    {
                        "value": "need"
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7ec50f7db906451583176361b7b8dcd7"
                        }
                    }
                ]
            },
            {
                "action": "getObjectItem",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-3b2e30685b3942f6a0decb07dd68a5eb",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-3cf12e0956b044b0ab98273b07cc975c"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-c87c2407a0154807b68019af2ef8ef32"
                        }
                    }
                ],
                "comment": "“半成品-半成品”关系缓存中1级子项的信息缓存"
            },
            {
                "action": "getObjectItem",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-3619a7892e5e447b950a391774117aa3",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-3b2e30685b3942f6a0decb07dd68a5eb"
                        }
                    },
                    {
                        "value": "subitems"
                    }
                ],
                "comment": "“半成品-半成品”关系缓存中1级子项的2级子项集合"
            },
            {
                "action": "loopForObjectItems",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-72486bb7cd53461bbdec4a27ba38185b",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-3619a7892e5e447b950a391774117aa3"
                        }
                    }
                ],
                "relationStep": [
                    "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-b83c659cc54542beb096c5fe278f790b"
                ],
                "comment": "遍历当前1级子项的所有2级子项"
            },
            {
                "action": "getObjectItem",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-3c14194f16544c51814ac6cc38a49510",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-72486bb7cd53461bbdec4a27ba38185b"
                        }
                    },
                    {
                        "value": "key"
                    }
                ],
                "comment": "2级子项料号"
            },
            {
                "action": "getObjectItem",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-c9d14ecdb8284ee293979848c9d51b34",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-72486bb7cd53461bbdec4a27ba38185b"
                        }
                    },
                    {
                        "value": "value"
                    }
                ],
                "comment": "2级子项信息集合"
            },
            {
                "action": "getObjectItem",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-069f98e4c9754fa186d1da7b329da7ec",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-c9d14ecdb8284ee293979848c9d51b34"
                        }
                    },
                    {
                        "value": "name"
                    }
                ],
                "comment": "2级子项名称"
            },
            {
                "action": "getObjectItem",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-553d551a26f34bc2a0289054d4ea60c4",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-c9d14ecdb8284ee293979848c9d51b34"
                        }
                    },
                    {
                        "value": "need"
                    }
                ],
                "comment": "每个1级子项对2级子项的需求量"
            },
            {
                "action": "mul",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-6bc7438879bf4cb888d2ec6a36f4d80b",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-553d551a26f34bc2a0289054d4ea60c4"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7ec50f7db906451583176361b7b8dcd7"
                        }
                    }
                ],
                "comment": "根物料对2级子项的需求量"
            },
            {
                "action": "getObjectItemWithDefault",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-ffc8c660d39446629d1859b0c6f1c69f",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-5acdfd734bf14b0f911ab527b2a977c9"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-3c14194f16544c51814ac6cc38a49510"
                        }
                    },
                    {
                        "value": {}
                    }
                ],
                "comment": "当前2级子物料信息集合"
            },
            {
                "action": "setObjectItem",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-f43a4006cf7a467784de8337f09f34e6",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-ffc8c660d39446629d1859b0c6f1c69f"
                        }
                    },
                    {
                        "value": "name"
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-069f98e4c9754fa186d1da7b329da7ec"
                        }
                    }
                ]
            },
            {
                "action": "setObjectItem",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-560b1db6aee44c2fa57b3c028fffc252",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-ffc8c660d39446629d1859b0c6f1c69f"
                        }
                    },
                    {
                        "value": "need"
                    },
                    {
                        "refResult": {
                            "stepID": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-6bc7438879bf4cb888d2ec6a36f4d80b"
                        }
                    }
                ]
            },
            {
                "action": "loopNext",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-b83c659cc54542beb096c5fe278f790b",
                "arguments": [],
                "relationStep": [
                    "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-72486bb7cd53461bbdec4a27ba38185b"
                ]
            },
            {
                "action": "loopNext",
                "id": "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-625ddbc6711845d9ac852c34e912b9f2",
                "arguments": [],
                "relationStep": [
                    "1ba6e7e8-9813-4811-9438-e1464fea39cf-S-7cd213ad30504bd2a77a2b98abd50da9"
                ]
            },
            {
                "action": "referenceData",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-99a560ad3361473d980becc210065839",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-e40f2dc3e98c4225aef28e16b653f617"
                        }
                    }
                ],
                "comment": "成品-子物料需求信息集合"
            },
            {
                "action": "getTableFromClipboard",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-f768d78e25b54ecca37f26f554c2f2ca",
                "arguments": [
                    {
                        "value": "输入成品排产计划表"
                    }
                ],
                "comment": "产品排产计划表"
            },
            {
                "action": "selectFromTable",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-07db38b1bb49474993419bff3fca5f30",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-f768d78e25b54ecca37f26f554c2f2ca"
                        }
                    },
                    {
                        "value": "column"
                    },
                    {
                        "value": "请选择“成品料号”所在的列"
                    }
                ],
                "comment": "成品料号列"
            },
            {
                "action": "selectFromTable",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-f5eaf727d6534d65a0464a539252b336",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-f768d78e25b54ecca37f26f554c2f2ca"
                        }
                    },
                    {
                        "value": "column"
                    },
                    {
                        "value": "请选择 按月统计数量 开始的列"
                    }
                ],
                "comment": "按月统计起始列号"
            },
            {
                "action": "selectFromTable",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-bbb21109ba6645e8a58afd1a237da45a",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-f768d78e25b54ecca37f26f554c2f2ca"
                        }
                    },
                    {
                        "value": "column"
                    },
                    {
                        "value": "请选择 按月统计数量 的最后一列"
                    }
                ],
                "comment": "按月统计结尾列号"
            },
            {
                "action": "sub",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-4f46c000c73d49df92769bcf4270cabf",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-bbb21109ba6645e8a58afd1a237da45a"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-f5eaf727d6534d65a0464a539252b336"
                        }
                    },
                    {
                        "value": -1
                    }
                ],
                "comment": "按月统计列的总数"
            },
            {
                "action": "inputByUser",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-51854f488682406dbeaba38978142609",
                "arguments": [
                    {
                        "value": "请输入关注的子料名称关键字。\n多个关键字用(关键字1|关键字2)的方式输入，注意其中的括号是英文半角模式的括号。\n如果不想做任何筛选，则请输入.*"
                    },
                    {
                        "value": "text"
                    },
                    {
                        "value": "制成板"
                    }
                ],
                "comment": "子料名称关键字"
            },
            {
                "action": "createObject",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-66e4f786867d4597abb6e6f1ce062d12",
                "arguments": [],
                "comment": "物料需求登记集合"
            },
            {
                "action": "createObject",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-436cc5321c12494fae4690468aa4efab",
                "arguments": [],
                "comment": "子料名称集合"
            },
            {
                "action": "loopForTableRow",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-99a2be89dc3946a4abf32f49e986440b",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-f768d78e25b54ecca37f26f554c2f2ca"
                        }
                    },
                    {
                        "value": 0
                    }
                ],
                "relationStep": [
                    "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-3593d64312e14a02862fa61ce684e917"
                ],
                "comment": "每行产品排产信息"
            },
            {
                "action": "getArrayElement",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-5125540cdb834accb8edeffe7afda463",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-99a2be89dc3946a4abf32f49e986440b"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-07db38b1bb49474993419bff3fca5f30"
                        }
                    }
                ],
                "comment": "成品料号"
            },
            {
                "action": "getSubArray",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-42a9b6f67333467b95d628dc5e00b299",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-99a2be89dc3946a4abf32f49e986440b"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-f5eaf727d6534d65a0464a539252b336"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-4f46c000c73d49df92769bcf4270cabf"
                        }
                    }
                ],
                "comment": "当前成品各月排产需求信息集合"
            },
            {
                "action": "getObjectItem",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-8678dfdb860a408bbf084624d1e9437b",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-99a560ad3361473d980becc210065839"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-5125540cdb834accb8edeffe7afda463"
                        }
                    }
                ],
                "comment": "当前成品的信息集合"
            },
            {
                "action": "getObjectItem",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-5091f0497e544db98b8ea82665557b43",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-8678dfdb860a408bbf084624d1e9437b"
                        }
                    },
                    {
                        "value": "subitems"
                    }
                ],
                "comment": "当前成品的子料集合"
            },
            {
                "action": "loopForObjectItems",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-dcf61ff17f594d6b8d947c3127940328",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-5091f0497e544db98b8ea82665557b43"
                        }
                    }
                ],
                "relationStep": [
                    "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-34d4c18db43b46d898b0ca0447613205"
                ],
                "comment": "成品的每个子料信息"
            },
            {
                "action": "getObjectItem",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-71c9ca1fc85b4a8294d549a7648f8b60",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-dcf61ff17f594d6b8d947c3127940328"
                        }
                    },
                    {
                        "value": "key"
                    }
                ],
                "comment": "子料料号"
            },
            {
                "action": "getObjectItem",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-46c6f9bba0e74a0185e2cda94921fa12",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-dcf61ff17f594d6b8d947c3127940328"
                        }
                    },
                    {
                        "value": "value"
                    }
                ],
                "comment": "子料信息"
            },
            {
                "action": "getObjectItem",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-97197d2c82654c12be1f52fedf05dea1",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-46c6f9bba0e74a0185e2cda94921fa12"
                        }
                    },
                    {
                        "value": "name"
                    }
                ],
                "comment": "子料名称"
            },
            {
                "action": "testTextByRegex",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-c99563e5b0ae4305b0b01b4553f0c35d",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-97197d2c82654c12be1f52fedf05dea1"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-51854f488682406dbeaba38978142609"
                        }
                    },
                    {
                        "value": false
                    }
                ],
                "comment": "匹配子料名称关键字"
            },
            {
                "action": "ifCondition",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-ee88093ae6bd4b208a25ef6efb959804",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-c99563e5b0ae4305b0b01b4553f0c35d"
                        }
                    },
                    {
                        "value": "0"
                    }
                ],
                "relationStep": [
                    "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-ed1579dcbbb640e9be3d14aa3eae1fb5"
                ],
                "comment": "子料名称满足关注的子料"
            },
            {
                "action": "setObjectItem",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-af5e17efd79d4e7886790ef9911152d3",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-436cc5321c12494fae4690468aa4efab"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-71c9ca1fc85b4a8294d549a7648f8b60"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-97197d2c82654c12be1f52fedf05dea1"
                        }
                    }
                ],
                "comment": "登记子料名称"
            },
            {
                "action": "getObjectItem",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-2aa0369620974ab2a853edafd44efbbe",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-46c6f9bba0e74a0185e2cda94921fa12"
                        }
                    },
                    {
                        "value": "need"
                    }
                ],
                "comment": "单个成品的子料需求量"
            },
            {
                "action": "getObjectItemWithDefault",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-3d74406a642649dfab9b71f7609b14a6",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-66e4f786867d4597abb6e6f1ce062d12"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-71c9ca1fc85b4a8294d549a7648f8b60"
                        }
                    },
                    {
                        "value": []
                    }
                ],
                "comment": "子料各个月的需求集合"
            },
            {
                "action": "loopForArrayElement",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-2bb8da94eadf417784ea88112f7bd26d",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-42a9b6f67333467b95d628dc5e00b299"
                        }
                    }
                ],
                "relationStep": [
                    "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-3e8d2c3bcab64763967d24e9c0a74fb8"
                ],
                "comment": "成品单月需求统计信息"
            },
            {
                "action": "mul",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-03ab9924381f4a198f6562708f154875",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-2aa0369620974ab2a853edafd44efbbe"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-2bb8da94eadf417784ea88112f7bd26d"
                        }
                    }
                ],
                "comment": "当前成品当前子料的当月需求总量"
            },
            {
                "action": "getArrayElement",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-2382a36a52fc4d2eb527720818894d2c",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-3d74406a642649dfab9b71f7609b14a6"
                        }
                    },
                    {
                        "refLoopIndex": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-2bb8da94eadf417784ea88112f7bd26d"
                        }
                    }
                ],
                "comment": "子料已记录的当月需求量"
            },
            {
                "action": "add",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-e4ea6adc6859435fbb82bc0e92136452",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-2382a36a52fc4d2eb527720818894d2c"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-03ab9924381f4a198f6562708f154875"
                        }
                    }
                ],
                "comment": "子料更新的当月需求量"
            },
            {
                "action": "setArrayElement",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-09433380d7cb44889019393241d7f517",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-3d74406a642649dfab9b71f7609b14a6"
                        }
                    },
                    {
                        "refLoopIndex": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-2bb8da94eadf417784ea88112f7bd26d"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-e4ea6adc6859435fbb82bc0e92136452"
                        }
                    }
                ],
                "comment": "记录最新的子料当月需求量"
            },
            {
                "action": "loopNext",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-3e8d2c3bcab64763967d24e9c0a74fb8",
                "arguments": [],
                "relationStep": [
                    "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-2bb8da94eadf417784ea88112f7bd26d"
                ],
                "comment": "当前成品的当前子料结束"
            },
            {
                "action": "endIf",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-ed1579dcbbb640e9be3d14aa3eae1fb5",
                "arguments": [],
                "relationStep": [
                    "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-ee88093ae6bd4b208a25ef6efb959804"
                ],
                "comment": "满足关注的子料结束"
            },
            {
                "action": "loopNext",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-34d4c18db43b46d898b0ca0447613205",
                "arguments": [],
                "relationStep": [
                    "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-dcf61ff17f594d6b8d947c3127940328"
                ],
                "comment": "当前成品的所有子料结束"
            },
            {
                "action": "loopNext",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-3593d64312e14a02862fa61ce684e917",
                "arguments": [],
                "relationStep": [
                    "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-99a2be89dc3946a4abf32f49e986440b"
                ]
            },
            {
                "action": "createTable",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-2f8b76b293424fc5a80aaed128bf07b9",
                "arguments": [],
                "comment": "子物料排产需求表"
            },
            {
                "action": "getTableRow",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-62198996ff714bf1822d1fa21ae9ec38",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-f768d78e25b54ecca37f26f554c2f2ca"
                        }
                    },
                    {
                        "value": 0
                    }
                ],
                "comment": "标题行"
            },
            {
                "action": "getSubArray",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-3466656a97394db889437dd5dcb0b3d7",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-62198996ff714bf1822d1fa21ae9ec38"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-f5eaf727d6534d65a0464a539252b336"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-4f46c000c73d49df92769bcf4270cabf"
                        }
                    }
                ],
                "comment": "月份标题头"
            },
            {
                "action": "makeupArray",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-b9d5220219c745e995a3cebb5e3d5a02",
                "arguments": [
                    {
                        "value": "子物料料号"
                    },
                    {
                        "value": "子物料名称"
                    }
                ],
                "comment": "标题头"
            },
            {
                "action": "appendArrayElementByArray",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-248a56ccbddd4d49aa0b50b245a7eda4",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-b9d5220219c745e995a3cebb5e3d5a02"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-3466656a97394db889437dd5dcb0b3d7"
                        }
                    }
                ]
            },
            {
                "action": "appendTableRow",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-3b4c95412f45483c99be8675f2b9615e",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-2f8b76b293424fc5a80aaed128bf07b9"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-b9d5220219c745e995a3cebb5e3d5a02"
                        }
                    }
                ]
            },
            {
                "action": "loopForObjectItems",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-acf7d8964b534863b7154f3922c61ad8",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-66e4f786867d4597abb6e6f1ce062d12"
                        }
                    }
                ],
                "relationStep": [
                    "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-4959f774dd744ea883706b16409a7910"
                ],
                "comment": "每个物料的需求信息集合"
            },
            {
                "action": "getObjectItem",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-15d3866a96884231be67425d59cb3458",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-acf7d8964b534863b7154f3922c61ad8"
                        }
                    },
                    {
                        "value": "key"
                    }
                ],
                "comment": "子料料号"
            },
            {
                "action": "getObjectItem",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-d256be066c424966a9e5f85f2a747b38",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-acf7d8964b534863b7154f3922c61ad8"
                        }
                    },
                    {
                        "value": "value"
                    }
                ],
                "comment": "子料各月需求集合"
            },
            {
                "action": "getObjectItem",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-a522bdce009c484fbb5b12164971f89f",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-436cc5321c12494fae4690468aa4efab"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-15d3866a96884231be67425d59cb3458"
                        }
                    }
                ],
                "comment": "子料名称"
            },
            {
                "action": "makeupArray",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-06c304134c9841a8ba0b52f7a254daaf",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-15d3866a96884231be67425d59cb3458"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-a522bdce009c484fbb5b12164971f89f"
                        }
                    }
                ],
                "comment": "子料需求行"
            },
            {
                "action": "appendArrayElementByArray",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-a0373d57fb2d4c8794665b6960f3c4c3",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-06c304134c9841a8ba0b52f7a254daaf"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-d256be066c424966a9e5f85f2a747b38"
                        }
                    }
                ]
            },
            {
                "action": "appendTableRow",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-fec6a865e4514ce9868d5b77511cfb1c",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-2f8b76b293424fc5a80aaed128bf07b9"
                        }
                    },
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-06c304134c9841a8ba0b52f7a254daaf"
                        }
                    }
                ]
            },
            {
                "action": "loopNext",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-4959f774dd744ea883706b16409a7910",
                "arguments": [],
                "relationStep": [
                    "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-acf7d8964b534863b7154f3922c61ad8"
                ]
            },
            {
                "action": "referenceData",
                "id": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-79239d085f554071aab569b1dddb15b6",
                "arguments": [
                    {
                        "refResult": {
                            "stepID": "90341885-4de1-47b4-a68f-4d3cb8b8f85b-S-2f8b76b293424fc5a80aaed128bf07b9"
                        }
                    }
                ],
                "comment": "最终结果-各子物料的各月需求计划表格"
            }
        ],
        "category": "物料需求"
    }
];

export default predefinedFunctions;
