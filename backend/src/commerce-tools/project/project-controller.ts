import { ProjectRepository } from './project-repo';

const createProjectRepo = () => {
  return new ProjectRepository();
};

export const getProject = async () => {
  const projectRepo = createProjectRepo();
  const project = await projectRepo.getProject();
  return project;
};

export const getProductTypes = async () => {
  const projectRepo = createProjectRepo();
  const project = await projectRepo.getProductTypes();
  return project;
};
