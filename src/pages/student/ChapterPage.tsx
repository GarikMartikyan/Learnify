import { Divider, Image, Typography } from "antd";
import { mockChapter } from "../../placeholder/chapter.ts";
import type { IChapter } from "../../constants/interfaces/chapter.interfaces.ts";
import { PageTitle } from "../../components/shared/PageTitle.tsx";

const { Title, Paragraph } = Typography;

interface ChapterPageProps {
  chapter: IChapter;
}

export function ChapterPage({ chapter = mockChapter }: ChapterPageProps) {
  return (
    <div style={{ margin: "0 auto" }}>
      <PageTitle showBackButton>{chapter.title}</PageTitle>
      <Divider />

      {chapter.content.map((block, index) => {
        switch (block.type) {
          case "title":
            return (
              <Title key={index} level={4} style={{ marginTop: 24 }}>
                {block.value}
              </Title>
            );
          case "text":
            return (
              <Paragraph key={index} style={{ fontSize: 16, lineHeight: 1.7 }}>
                {block.value}
              </Paragraph>
            );
          case "youtube":
            return (
              <div
                key={index}
                style={{
                  marginTop: 24,
                  marginBottom: 24,
                  marginInline: "auto",
                  maxWidth: 900,
                }}
              >
                <iframe
                  width="100%"
                  style={{ aspectRatio: "16/9" }}
                  src={block.value}
                  title="YouTube Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            );
          case "image":
            return (
              <div
                key={index}
                style={{ textAlign: "center", margin: "24px 0" }}
              >
                <Image
                  src={block.value}
                  alt="Chapter Image"
                  style={{ maxHeight: 500 }}
                />
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
