export default function Index() {
  const tableData = [
    {
      year: 2024,
      title: "NOVA CARBON",
      category: "GRAPHIC IDENTITY / 3D / SITE DESIGN / AI",
      link: "/nova-carbon",
    },
    {
      year: 2024,
      title: "MEMORIES",
      category: "AI",
      link: "/memories",
    },
    {
      year: 2024,
      title: "ARTXCODE",
      category: "GRAPHIC IDENTITY / SITE DESIGN",
      link: "/artxcode",
    },
    {
      year: 2024,
      title: "MARKCHAIN",
      category: "GRAPHIC IDENTITY / SITE DESIGN",
      link: "/markchain",
    },
    {
      year: 2024,
      title: "ARTIFICAL RESEARCH",
      category: "AI / VIDEO",
      link: "/artifical-research",
    },
    {
      year: 2024,
      title: "CLIFF CAPITAL",
      category: "GRAPHIC IDENTITY / SITE DESIGN",
      link: "/cliff-capital",
    },
    {
      year: 2024,
      title: "ELLIE",
      category: "AI / VIDEO / GRAPHIC IDENTITY",
      link: "/ellie",
    },
    {
      year: 2023,
      title: "ORENJI",
      category: "AI",
      link: "/orenji",
    },
    {
      year: 2023,
      title: "THOUGHTS",
      category: "AI / VIDEO",
      link: "/thoughts",
    },
    {
      year: 2023,
      title: "AXIS MUNDI",
      category: "3D / VIDEO / GRAPHIC IDENTITY / AI / SITE DESIGN",
      link: "/axis-mundi",
    },
    {
      year: 2023,
      title: "RED STAR",
      category: "GRAPHIC IDENTITY",
      link: "/red-star",
    },
  ];

  return (
    <>
      <section className="text-[.65625rem]/[.8125rem] tracking-[.015em] absolute inset-0 mr-auto flex h-full w-full flex-col sm:py-0">
        <ul className="flex h-full flex-col items-start justify-start overflow-x-auto px-1 py-28 sm:py-[9rem]">
          <li className="mb-5 flex opacity-0" style={{ opacity: "1" }}>
            <span className="w-[85px] flex-shrink-0">YEAR</span>
            <span className="w-[170px] flex-shrink-0">TITLE</span>
            <span className="w-[100%]">CATEGORY</span>
          </li>
          {tableData.map((data) => {
            return (
              <>
                <li className="flex opacity-0 " style={{ opacity: "1" }}>
                  <a
                    href={data.link}
                    className="flex w-auto flex-shrink-0 py-[0.325rem] opacity-[0.3] hover:opacity-[1]"
                  >
                    <span className="w-[85px] flex-shrink-0">{data.year}</span>
                    <span className="w-[170px] flex-shrink-0">
                      {data.title}
                    </span>
                    <span className="flex flex-shrink-0">{data.category}</span>
                  </a>
                  <div className="pointer-events-none w-[calc(80px)] flex-shrink-0 sm:hidden"></div>
                </li>
              </>
            );
          })}
        </ul>
      </section>
    </>
  );
}
