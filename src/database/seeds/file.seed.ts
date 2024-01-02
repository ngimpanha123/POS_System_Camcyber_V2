const fileSeed = {
    folders: [
        {
            project_id: 1,
            parent_id: null,
            name: 'dms',
        },
        {
            project_id: 2,
            parent_id: null,
            name: 'pos',
        }
    ],
    types: [
        {
            name: 'Image',
            icon: 'N/A'
        },
        {
            name: 'Document',
            icon: 'N/A'
        },
        {
            name: 'Audio',
            icon: 'N/A'
        },
        {
            name: 'Video',
            icon: 'N/A'
        },
        {
            name: 'Archive',
            icon: 'N/A'
        },
        {
            name: 'Database',
            icon: 'N/A'
        }
    ],
    extensions: [
        /** @ImageFiles */
        {
            type_id: 1,
            name: 'jpg',
            fullname: 'Joint Photographic Experts Group',
            icon: 'N/A',
        },
        {
            type_id: 1,
            name: 'jpeg',
            fullname: 'Joint Photographic Experts Group',
            icon: 'N/A',
        },
        {
            type_id: 1,
            name: 'png',
            fullname: 'Portable Network Graphics',
            icon: 'N/A',
        },
        {
            type_id: 1,
            name: 'gif',
            fullname: 'Graphics Interchange Format',
            icon: 'N/A',
        },
        {
            type_id: 1,
            name: 'svg',
            fullname: 'Scalable Vector Graphics',
            icon: 'N/A',
        },
        {
            type_id: 1,
            name: 'heif',
            fullname: 'High-Efficiency Image File Format',
            icon: 'N/A',
        },
        {
            type_id: 1,
            name: 'heic',
            fullname: 'High-Efficiency Image File Format',
            icon: 'N/A',
        },
        /** @DocumentFiles */
        {
            type_id: 2,
            name: 'txt',
            fullname: 'Plain text documents',
            icon: 'N/A',
        },
        {
            type_id: 2,
            name: 'csv',
            fullname: 'Comma-Separated Values',
            icon: 'N/A',
        },
        {
            type_id: 2,
            name: 'pdf',
            fullname: 'Portable Document Format',
            icon: 'N/A',
        },
        {
            type_id: 2,
            name: 'doc',
            fullname: 'Microsoft Word document',
            icon: 'N/A',
        },
        {
            type_id: 2,
            name: 'docx',
            fullname: 'Microsoft Word document',
            icon: 'N/A',
        },
        {
            type_id: 2,
            name: 'ppt',
            fullname: 'Microsoft PowerPoint presentation',
            icon: 'N/A',
        },
        {
            type_id: 2,
            name: 'pptx',
            fullname: 'Microsoft PowerPoint Open XML presentation',
            icon: 'N/A',
        },
        {
            type_id: 2,
            name: 'xls',
            fullname: 'Microsoft Excel spreadsheet',
            icon: 'N/A',
        },
        {
            type_id: 2,
            name: 'xlsx',
            fullname: 'Microsoft Excel Open XML spreadsheet',
            icon: 'N/A',
        },
        {
            type_id: 2,
            name: 'odt',
            fullname: 'OpenDocument Text',
            icon: 'N/A',
        },
        {
            type_id: 2,
            name: 'odp',
            fullname: 'OpenDocument Presentation',
            icon: 'N/A',
        },
        {
            type_id: 2,
            name: 'ods',
            fullname: 'OpenDocument Spreadsheet',
            icon: 'N/A',
        },
        /** @AudioFiles */
        {
            type_id: 3,
            name: 'mp3',
            fullname: 'MPEG-1 Audio Layer 3',
            icon: 'N/A',
        },
        {
            type_id: 3,
            name: 'wav',
            fullname: 'Waveform Audio File Format',
            icon: 'N/A',
        },
        {
            type_id: 3,
            name: 'flac',
            fullname: 'Free Lossless Audio Codec',
            icon: 'N/A',
        },
        {
            type_id: 3,
            name: 'ogg',
            fullname: 'Ogg Vorbis audio',
            icon: 'N/A',
        },
        {
            type_id: 3,
            name: 'aiff',
            fullname: 'Audio Interchange File Format',
            icon: 'N/A',
        },
        {
            type_id: 3,
            name: 'aac',
            fullname: 'Advanced Audio Coding',
            icon: 'N/A',
        },
        /** @VideoFiles */
        {
            type_id: 4,
            name: 'mp4',
            fullname: 'MP4 video file',
            icon: 'N/A',
        },
        {
            type_id: 4,
            name: 'mkv',
            fullname: 'Matroska Multimedia Container',
            icon: 'N/A',
        },
        {
            type_id: 4,
            name: 'mov',
            fullname: 'QuickTime video',
            icon: 'N/A',
        },
        {
            type_id: 4,
            name: 'wmv',
            fullname: 'Windows Media Video',
            icon: 'N/A',
        },
        /** @ArchiveFiles */
        {
            type_id: 5,
            name: 'zip',
            fullname: 'Compressed archive file',
            icon: 'N/A',
        },
        {
            type_id: 5,
            name: 'rar',
            fullname: 'Roshal Archive',
            icon: 'N/A',
        },
        {
            type_id: 5,
            name: 'tar',
            fullname: 'Tar archives',
            icon: 'N/A',
        },
        {
            type_id: 5,
            name: 'gz',
            fullname: 'Gzip-compressed files',
            icon: 'N/A',
        },
        /** @DatabaseFiles */
        {
            type_id: 6,
            name: 'sql',
            fullname: 'SQL database file',
            icon: 'N/A',
        },
        {
            type_id: 6,
            name: 'db',
            fullname: 'Generic database file',
            icon: 'N/A',
        },
        {
            type_id: 6,
            name: 'sqlite',
            fullname: 'SQLite database file',
            icon: 'N/A',
        }
    ],
    files: [
        {
            folder_id: 1,
            type_id: 1,
            extention_id: 1,
            filename: 'test',
            originalname: 'test',
            mimetype: 'image/png',
            uri: 'api/file/serve/dce9f357-503d-4c6f-bf3f-6b4eb0423406',
            path: '/path/to/file1.png',
            size: 12345,
            encoding: 'base64'
        }
    ]
}
export default fileSeed;