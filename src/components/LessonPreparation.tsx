import { Link } from "react-router-dom";
import { studyBasics } from "../data/studyBasics";
import { studyTopics, type StudyPage } from "../data/studyTopics";

export default function LessonPreparation({ page, topicSlug }: { page: StudyPage; topicSlug: string }) {
  const guidance = page.guidance;
  if (!guidance) return null;
  const prerequisites = guidance.prerequisites.flatMap(id => studyTopics.flatMap(topic =>
    topic.pages.flatMap((item, index) => item.id === id
      ? [{ id, title: `${topic.title}: ${item.title}`, to: `/topics?topic=${topic.slug}&page=${index + 1}` }]
      : [])
  ));
  return <article className="study-focus-card">
    <h2>Det här ska du kunna</h2>
    <p>{guidance.goal}</p>
    {prerequisites.length > 0 && <>
      <p>Om något är nytt, börja med dessa förkunskaper:</p>
      <ul>{prerequisites.map(item => <li key={item.id}><Link to={item.to}>{item.title}</Link></li>)}</ul>
    </>}
    <details key={page.id} open={page.id.endsWith("-p1")}>
      <summary>Grunder och förutsättningar för ämnet</summary>
      {studyBasics[topicSlug]?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
    </details>
  </article>;
}
