import type { Metadata } from "next";
import QueryShadowApp from "./QueryShadowApp";

export const metadata: Metadata = {
  title: "QueryShadow — See what your agent's searches reveal together",
  description: "A local-first privacy debugger for mosaic leakage across AI-agent search traces.",
};

export default function Home() {
  return <QueryShadowApp />;
}
