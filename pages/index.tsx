import Head from "next/head"
import { Layout } from "@/components/layout/layout"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturesSection } from "@/components/home/features-section"
import { StatsSection } from "@/components/home/stats-section"

export default function Home() {
  return (
    <>
      <Head>
        <title>Mi Proyecto - Gestión Financiera Inteligente</title>
        <meta
          name="description"
          content="Plataforma integral para la gestión de finanzas personales y empresariales con reportes avanzados"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
      </Layout>
    </>
  )
}
