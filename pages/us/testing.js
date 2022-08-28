import Head from "next/head";
import {
  Container,
  Heading,
  Stack,
  Text,
  Box,
  Divider,
  Tooltip,
} from "@chakra-ui/react";
import USTestPositivityTable from "../components/us/USTestPositivityTable";
import USTestPositivityChart from "../components/us/USTestPositivityChart";

const About = () => {
  return (
    <>
      <Head>
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
              page_path: window.location.pathname,
            });
          `,
          }}
        />

        <title>U.S. Testing Information | Monkeypox Tracker</title>
        <meta
          name="description"
          content={`Statistics and information on Monkeypox testing in the United States, including maps, charts, and tables.`}
        />

        <meta
          property="og:title"
          content={`Monkeypox Testing in the United States`}
        />
        <meta
          property="og:description"
          content={`Statistics and information on Monkeypox testing in the United States, including maps, charts, and tables`}
        />

        <meta property="og:url" content="https://monkeypoxtracker.net/" />
        <meta
          property="og:image"
          content="https://monkeypoxtracker.net/usTestingSocialImg.png"
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:description"
          content={`Statistics and information on Monkeypox testing in the United States, including maps, charts, and tables`}
        />
        <meta
          property="twitter:image"
          content="https://monkeypoxtracker.net/usTestingSocialImg.png"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <Container mt={10} mb={10} maxW={"5xl"}>
          <Heading as="h1">Testing Positivity</Heading>
          <Text>
            This page contains US-specific information provided by the CDC on
            Monkeypox testing.
          </Text>
          <USTestPositivityChart />
          <USTestPositivityTable />
        </Container>
      </div>
    </>
  );
};

export default About;
