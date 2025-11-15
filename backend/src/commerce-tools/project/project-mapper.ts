import { Project as CTProject } from '@commercetools/platform-sdk';
import { Project } from '../../../../types/project';

export class ProjectMapper {
  static CTProjectToProject(project: CTProject): Project {
    return {
      name: project.name,
      countries: project.countries,
      currencies: project.countries,
      languages: project.languages,
    };
  }
}
