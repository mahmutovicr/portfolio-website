import type { Project } from '../types'

interface Props {
  project: Project
}

export function ProjectCard({ project }: Props) {
  return (
      <a
      className="project-card"
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="card-header">
        <div>
          <div className="card-title">{project.title}</div>
          <div className="card-desc">{project.description}</div>
        </div>
        <span className="card-arrow">&#8599;</span>
      </div>
      <div className="card-visual">
        <img
          className="card-img"
          src={project.screenshot}
          alt={`${project.title} – ${project.description}`}
          width={1280}
          height={720}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: project.objectPosition ?? 'top center' }}
        />
        <span className="card-live-label">Live Demo &#8599;</span>
      </div>
    </a>
  )
}