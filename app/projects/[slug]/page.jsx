import { projects } from '@/app/data/projects';
import ProjectContent from './ProjectContent';

// Generate static params for all projects
export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default function ProjectPage({ params }) {
  return <ProjectContent slug={params.slug} />;
}
