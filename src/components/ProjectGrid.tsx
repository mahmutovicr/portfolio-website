import { PROJECTS } from '../data/projects'
import { ProjectCard } from './ProjectCard'

export function ProjectGrid() {
  return (
    <section id="projects" aria-label="Portfolio Projects">
      <h2 className="sr-only">Selected Projects by Rahman Mahmutović</h2>
      <div id="grid">
        {PROJECTS.map(project => (
          <ProjectCard key={project.url} project={project} />
        ))}
      </div>
    </section>
  )
}
