import Project from "../models/project.model";

const selectProjectProperties = (project: Project) => {
    return {
        id: project.id,
        name: project.name,
        abbre: project.abbre,
        icon: project.icon,
        secret: project.secret,
        authorized_ip: project.authorized_ip,
        username: atob(project.secret).split(':')[0],
        password: atob(project.secret).split(':')[1]
    };
}

export default selectProjectProperties;