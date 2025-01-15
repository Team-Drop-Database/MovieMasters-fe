"use client";

import React, { useEffect, useState } from "react";


export default function Thread({ params }: { params: Promise<{ id: string }> }) {
  const [topicId, setTopicId] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setTopicId(resolvedParams.id);
    });
  }, [params]);

  return (
    <div>
      Hallo, dit is de pagina voor topic met id: {topicId}
    </div>
  );
}
