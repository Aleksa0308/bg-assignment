import axios from 'axios';

interface ApiResponse {
    items: FileInfo[];
}

interface FileInfo {
    fileUrl: string;
}

interface FileStructure {
    [key: string]: Directory | string[];
}

interface Directory {
    [key: string]: Directory | string[];
}
class FileProcessService {
    async processFile() {
        try {
            const data = await this.fetchData();
            // const data = { items: this.mockData };
            return this.buildResponseObject(data.items);
        } catch (error) {
            logging.error(`Error processing file: ${error}`);
        }
    }

    async fetchData() {
        const response = await axios.get<ApiResponse>(`https://rest-test-eight.vercel.app/api/test`);
        return response.data;
    }

    // Mock Testing Data on smaller data set
    mockData: FileInfo[] = [
        {
            fileUrl: 'http://34.8.32.234:48183/SvnRep/ADV-H5-New/README.txt'
        },
        {
            fileUrl: 'http://34.8.32.234:48183/SvnRep/ADV-H5-New/VisualSVN.lck'
        },
        {
            fileUrl: 'http://34.8.32.234:48183/SvnRep/ADV-H5-New/hooks-env.tmpl'
        },
        {
            fileUrl: 'http://34.8.32.234:48183/SvnRep/AT-APP/README.txt'
        },
        {
            fileUrl: 'http://34.8.32.234:48183/SvnRep/AT-APP/VisualSVN.lck'
        },
        {
            fileUrl: 'http://34.8.32.234:48183/SvnRep/AT-APP/hooks-env.tmpl'
        },
        {
            fileUrl: 'http://34.8.32.234:48183/SvnRep/README.txt'
        },
        {
            fileUrl: 'http://34.8.32.234:48183/SvnRep/VisualSVN.lck'
        },
        {
            fileUrl: 'http://34.8.32.234:48183/SvnRep/hooks-env.tmpl'
        },
        {
            fileUrl: 'http://34.8.32.234:48183/www/README.txt'
        },
        {
            fileUrl: 'http://34.8.32.234:48183/www/VisualSVN.lck'
        },
        {
            fileUrl: 'http://34.8.32.234:48183/www/hooks-env.tmpl'
        }
    ];

    buildResponseObject(data: FileInfo[]) {
        const result: FileStructure = {};

        for (const { fileUrl } of data) {
            const ip = this.getIpFromUrl(fileUrl);
            const pathParts = this.getPathParts(fileUrl);

            this.initIp(result, ip);
            let currentLevel: Directory | string[] = result[ip];

            for (let i = 0; i < pathParts.length; i++) {
                const part = pathParts[i];

                if (this.isLastSegment(pathParts, i)) {
                    // Push the file to the current level
                    if (Array.isArray(currentLevel)) {
                        currentLevel.push(part);
                    } else if (typeof currentLevel === 'object') {
                        // The array isn't created yet
                        if (!Array.isArray(currentLevel[part])) {
                            currentLevel[part] = [];
                        }
                        currentLevel = currentLevel[part];
                    }
                } else {
                    // Not a file, it's a directory
                    if (Array.isArray(currentLevel)) {
                        currentLevel = this.findOrCreateDirectory(currentLevel, part);
                    } else if (typeof currentLevel === 'object') {
                        if (!Array.isArray(currentLevel[part])) {
                            currentLevel[part] = [];
                        }
                        currentLevel = currentLevel[part];
                    }
                }
            }
        }

        return result;
    }

    isLastSegment = (pathParts: string[], i: number) => {
        return i === pathParts.length - 1;
    };
    getIpFromUrl = (url: string) => {
        return new URL(url).host.split(':')[0];
    };

    getPathParts = (url: string) => {
        return new URL(url).pathname.split('/').filter((part) => part);
    };

    initIp = (result: FileStructure, ip: string) => {
        if (!result[ip]) {
            result[ip] = [];
        }
    };

    findOrCreateDirectory = (currentLevel: (Directory | string[] | string)[], directoryName: string): Directory | string[] => {
        let directory = currentLevel.find((entry): entry is Directory => typeof entry === 'object' && entry.hasOwnProperty(directoryName));

        if (!directory) {
            directory = { [directoryName]: [] };
            currentLevel.push(directory);
        }

        return directory[directoryName] as Directory | string[];
    };
}

export default new FileProcessService();
