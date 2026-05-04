export type ResumeWorkspaceDraft = {
  full_name: string;
  role_title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  skills: string[];
  selected_focus: string;
  experience: Array<{
    title: string;
    company: string;
    period: string;
    bullets: string[];
  }>;
  projects: Array<{
    name: string;
    role: string;
    period: string;
    bullets: string[];
  }>;
  education: Array<{
    school: string;
    degree: string;
    period: string;
    bullets: string[];
  }>;
  certifications: string[];
};

const DEFAULT_SUMMARY =
  'Student or early-career candidate focused on building clear evidence, crisp project stories, and a role-specific resume.';

function escapeLatex(input: string) {
  return input
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

function buildBulletList(lines: string[]) {
  const clean = lines.map((line) => line.trim()).filter(Boolean);
  if (clean.length === 0) {
    return '\\item{}';
  }

  return clean.map((line) => `\\item{${escapeLatex(line)}}`).join('\n');
}

export function generateAwesomeCvLatex(input: ResumeWorkspaceDraft) {
  const skills = input.skills.filter(Boolean).join(' · ');
  const certifications = input.certifications.filter(Boolean).join(' · ');
  const experienceSection = input.experience.length
    ? input.experience
        .map(
          (item) => `\\cventry
  {${escapeLatex(item.period || 'Present')}}
  {${escapeLatex(item.title || 'Role')}}
  {${escapeLatex(item.company || 'Company')}}
  {}
  {}
  {
    \\begin{cvitems}
${buildBulletList(item.bullets)}
    \\end{cvitems}
  }`,
        )
        .join('\n\n')
    : `\\cventry
  {2026}
  {Project Lead}
  {Representative Project}
  {}
  {}
  {
    \\begin{cvitems}
      \\item{Shipped a concise project story with concrete scope, stack, and measurable outcome.}
      \\item{Translated project experience into role-specific resume evidence.}
    \\end{cvitems}
    }`;

  const projectSection = input.projects.length
    ? `\n\\cvsection{Projects}
\\begin{cventries}
${input.projects
  .map(
    (item) => `\\cventry
  {${escapeLatex(item.period || 'Present')}}
  {${escapeLatex(item.name || 'Project')}}
  {${escapeLatex(item.role || 'Owner')}}
  {}
  {}
  {
    \\begin{cvitems}
${buildBulletList(item.bullets)}
    \\end{cvitems}
  }`,
  )
  .join('\n\n')}
\\end{cventries}`
    : '';

  const educationSection = input.education.length
    ? input.education
        .map(
          (item) => `\\cventry
  {${escapeLatex(item.period || 'Present')}}
  {${escapeLatex(item.degree || 'Degree')}}
  {${escapeLatex(item.school || 'School')}}
  {}
  {}
  {
    \\begin{cvitems}
${buildBulletList(item.bullets)}
    \\end{cvitems}
  }`,
        )
        .join('\n\n')
    : `\\cventry
  {2026}
  {Bachelor's Degree}
  {Your University}
  {}
  {}
  {
    \\begin{cvitems}
      \\item{Add coursework, awards, or research only when it strengthens the target role.}
    \\end{cvitems}
  }`;

  return `\\documentclass[11pt, a4paper]{awesome-cv}

\\geometry{left=1.4cm, top=.8cm, right=1.4cm, bottom=1.2cm, footskip=.5cm}
\\fontdir[fonts/]
\\colorlet{awesome}{awesome-emerald}
\\setbool{acvSectionColorHighlight}{true}
\\renewcommand{\\acvHeaderSocialSep}{\\quad\\textbar\\quad}

\\name{${escapeLatex(input.full_name || 'Your Name')}}{}
\\position{${escapeLatex(input.role_title || 'Target Role')}}
\\address{${escapeLatex(input.location || 'City, Country')}}
\\mobile{${escapeLatex(input.phone || '+00-0000-0000')}}
\\email{${escapeLatex(input.email || 'name@example.com')}}
\\homepage{${escapeLatex(input.website || 'portfolio.example.com')}}
${input.linkedin ? `\\linkedin{${escapeLatex(input.linkedin)}}` : ''}
${input.github ? `\\github{${escapeLatex(input.github)}}` : ''}

\\begin{document}
\\makecvheader

\\cvsection{Profile}
\\begin{cvparagraph}
${escapeLatex(input.summary.trim() || DEFAULT_SUMMARY)}
\\end{cvparagraph}

\\cvsection{Skills}
\\begin{cvskills}
  \\cvskill{Core Stack}{${escapeLatex(skills || 'Type your strongest tools, frameworks, and domain knowledge here.')}}
  ${input.selected_focus ? `\\cvskill{Target Focus}{${escapeLatex(input.selected_focus)}}` : ''}
  ${certifications ? `\\cvskill{Certificates}{${escapeLatex(certifications)}}` : ''}
\\end{cvskills}

\\cvsection{Experience}
\\begin{cventries}
${experienceSection}
\\end{cventries}
${projectSection}

\\cvsection{Education}
\\begin{cventries}
${educationSection}
\\end{cventries}

\\end{document}
`;
}
