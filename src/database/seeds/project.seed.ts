import dotenv from 'dotenv';
dotenv.config();

const projectSeed = {
    projects: [
        {
            name: 'Document Manangement System',
            icon: 'https://cdn.icon-icons.com/icons2/2415/PNG/512/php_plain_logo_icon_146397.png',
            abbre: 'DMS',
            secret: btoa('mpwt:mpwt@dms'),
            authorized_ip: process.env.AUTHHOIZED_IP_PMS || null // allowNull=true
        },
        {
            name: 'CamCyber POS',
            icon: 'https://cdn.icon-icons.com/icons2/2415/PNG/512/php_plain_logo_icon_146397.png',
            abbre: 'POS',
            secret: btoa('CamCyber:pos@123'),
            authorized_ip: process.env.AUTHHOIZED_IP_POS || null // allowNull=true
        }
    ]
}
export default projectSeed;