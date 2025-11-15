import { BaseRepository } from '../base-repo';
import { ProjectMapper } from './project-mapper';

export class ProjectRepository extends BaseRepository {
  constructor() {
    super();
  }
  async getProject() {
    const project = await this.getCtProject();
    const mappedProject = ProjectMapper.CTProjectToProject(project);
    return mappedProject;
  }

  async getProductTypes() {
    const productTypes = await this.getCtProductTypes();
    return productTypes;
  }
}
