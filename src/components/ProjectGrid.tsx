import { PROJECTS } from '../data/projects'
import { ProjectCard } from './ProjectCard'

export function ProjectGrid() {
  return (
    <section id="projects" aria-label="Portfolio Projects">
      <div id="grid">
        {PROJECTS.map(project => (
          <ProjectCard key={project.url} project={project} />
        ))}
      </div>
    </section>
  )
}