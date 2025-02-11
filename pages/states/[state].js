import React, { useState } from "react";
import Head from "next/head.js";
import { csv } from "csvtojson";
import { colors } from "../../styles/colors.js";
import { Line } from "react-chartjs-2";
import {
  Text,
  Center,
  Heading,
  Container,
  GridItem,
  SimpleGrid,
  Grid,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Breadcrumb,
  BreadcrumbItem,
  Box,
  Stack,
} from "@chakra-ui/react";

import { ChevronRightIcon } from "@chakra-ui/icons";
import Chart from "chart.js/auto";

import Link from "next/link";

export const getStaticPaths = async () => {
  // csc api
  var headers = new Headers();
  headers.append("X-CSCAPI-KEY", process.env.NEXT_PUBLIC_CSC_API_KEY);

  var requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow",
  };

  const url = "https://api.countrystatecity.in/v1/states";

  const res = await fetch(url, requestOptions);
  const text = await res.text();
  const data = await JSON.parse(text);

  // encode the country and state iso2 codes into the URL
  const paths = data.map((stateVal) => {
    return {
      params: {
        state: `${stateVal.country_code.toString()}_${stateVal.iso2.toString()}`,
      },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export const getStaticProps = async (context) => {
  //destructure to URL into the country and state iso2 codes
  const codesArray = context.params.state.toString().split("_");
  const countryIso2 = codesArray[0].toString();
  const stateIso2 = codesArray[1].toString();

  // csc api
  var headers = new Headers();
  headers.append("X-CSCAPI-KEY", process.env.NEXT_PUBLIC_CSC_API_KEY);

  var requestOptions = {
    method: "GET",
    headers: headers,
    redirect: "follow",
  };

  const countryDetailsUrl = `https://api.countrystatecity.in/v1/countries/${countryIso2}`;
  const countryDetailsRes = await fetch(countryDetailsUrl, requestOptions);
  const countryDetailsText = await countryDetailsRes.text();
  const countryDetails = await JSON.parse(countryDetailsText);

  const countryDataUrl =
    "https://gist.githubusercontent.com/pearcircuitmike/9294ac4f756611b1d8103c0a0b879836/raw/";
  const res = await fetch(countryDataUrl);
  const text = await res.text();
  const jsonArray = await csv().fromString(text);
  const filteredJsonArray = jsonArray.filter(
    (x) => x.location === countryDetails.name
  );

  const stateDataUrl = `https://api.countrystatecity.in/v1/countries/${countryIso2}/states/${stateIso2}`;

  const stateDataRes = await fetch(stateDataUrl, requestOptions);
  const stateDataText = await stateDataRes.text();
  const stateDataDetails = await JSON.parse(stateDataText);

  return {
    props: {
      countryCaseData: filteredJsonArray,
      countryDetails: countryDetails,
      stateDetails: stateDataDetails,
    },
  };
};

const CountryDetails = ({ countryCaseData, countryDetails, stateDetails }) => {
  const filteredDates = JSON.parse(
    JSON.stringify(
      countryCaseData.map((y) => {
        return y["date"];
      })
    )
  );
  const filteredTotalCases = JSON.parse(
    JSON.stringify(
      countryCaseData.map((y) => {
        return y["total_cases"];
      })
    )
  );
  const filteredNewCases = JSON.parse(
    JSON.stringify(
      countryCaseData.map((y) => {
        return y["new_cases"];
      })
    )
  );
  const filteredNewCasesPerMillion = JSON.parse(
    JSON.stringify(
      countryCaseData.map((y) => {
        return y["new_cases_per_million"];
      })
    )
  );
  const filteredTotalCasesPerMillion = JSON.parse(
    JSON.stringify(
      countryCaseData.map((y) => {
        return y["total_cases_per_million"];
      })
    )
  );

  const filteredNewDeaths = JSON.parse(
    JSON.stringify(
      countryCaseData.map((y) => {
        return y["new_deaths"];
      })
    )
  );

  const chartDataTotalCases = {
    labels: filteredDates,
    datasets: [
      {
        label: "Total Cases",
        fill: false,
        lineTension: 0.1,
        backgroundColor: colors.tyrianPurple,
        borderColor: colors.tyrianPurple,
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: colors.tyrianPurple,
        pointBackgroundColor: colors.tyrianPurple,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: colors.tyrianPurple,
        pointHoverBorderColor: colors.tyrianPurple,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: filteredTotalCases,
      },
      {
        label: "New Cases",
        fill: true,
        lineTension: 0.1,
        backgroundColor: colors.darkOrange,
        borderColor: colors.darkOrange,
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: colors.darkOrange,
        pointBackgroundColor: colors.darkOrange,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: colors.darkOrange,
        pointHoverBorderColor: colors.darkOrange,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: filteredNewCases,
      },
    ],
  };
  const chartDataTotalCasesPerMillion = {
    labels: filteredDates,
    datasets: [
      {
        label: "Total Cases Per Million",
        fill: false,
        lineTension: 0.1,
        backgroundColor: colors.rubyRed,
        borderColor: colors.rubyRed,
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: colors.rubyRed,
        pointBackgroundColor: colors.rubyRed,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: colors.rubyRed,
        pointHoverBorderColor: colors.rubyRed,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: filteredTotalCasesPerMillion,
      },
      {
        label: "New Cases Per Million",
        fill: true,
        lineTension: 0.1,
        backgroundColor: colors.tumbleweed,
        borderColor: colors.tumbleweed,
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: colors.tumbleweed,
        pointBackgroundColor: colors.tumbleweed,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: colors.tumbleweed,
        pointHoverBorderColor: colors.tumbleweed,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: filteredNewCasesPerMillion,
      },
    ],
  };
  const chartDataNewDeaths = {
    labels: filteredDates,
    datasets: [
      {
        label: "New Deaths",
        fill: false,
        lineTension: 0.1,
        backgroundColor: colors.kineticBlack,
        borderColor: colors.kineticBlack,
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: colors.kineticBlack,
        pointBackgroundColor: colors.kineticBlack,
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: colors.kineticBlack,
        pointHoverBorderColor: colors.kineticBlack,
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: filteredNewDeaths,
      },
    ],
  };

  const [copied, setCopied] = useState(false);

  function copy() {
    const el = document.createElement("input");
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setCopied(true);
  }
  const [stateName, setStateName] = useState(
    stateDetails.name ? stateDetails.name : ""
  );
  const [countryName, setCountryName] = useState(
    countryDetails.name ? countryDetails.name : ""
  );
  const [countryNewCases, setCountryNewCases] = useState(
    countryCaseData.length
      ? ~~countryCaseData[countryCaseData.length - 1].new_cases
      : ""
  );
  const [countryNewDeaths, setCountryNewDeaths] = useState(
    countryCaseData.length
      ? ~~countryCaseData[countryCaseData.length - 1].new_deaths
      : "0"
  );

  const [countryTotalCases, setCountryTotalCases] = useState(
    countryCaseData.length
      ? ~~countryCaseData[countryCaseData.length - 1].total_cases
      : "0"
  );
  const [countryTotalDeaths, setCountryTotalDeaths] = useState(
    countryCaseData.length
      ? ~~countryCaseData[countryCaseData.length - 1].total_deaths
      : "0"
  );

  const currentMonth = new Date().toLocaleString("en-US", { month: "long" });
  const currentYear = new Date().getFullYear();

  return (
    <>
      <Head>
        <meta httpEquiv="content-language" content="en-gb" />

        <title>
          Ebola in {stateName}, {countryName} as of {currentMonth} {currentYear}{" "}
          | Ebola Cases
        </title>
        <meta
          name="description"
          content={`Charting the ${stateName}, ${countryName} ebola outbreak. Updated ${currentMonth} ${currentYear} cases and deaths.`}
        />

        <meta
          property="og:title"
          content={`Ebola in ${stateName}, ${countryName} as of ${currentMonth} ${currentYear} | Ebola Cases - Ebola Deaths`}
        />
        <meta
          property="og:description"
          content={`Charting the ${stateName}, ${countryName} ebola outbreak. Updated ${currentMonth} ${currentYear} cases and deaths.`}
        />

        <meta property="og:url" content="https://ebola-cases.com/" />
        <meta
          property="og:image"
          content="https://ebola-cases.com/socialImg.png"
        />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:description"
          content={`Charting the ${stateName}, ${countryName} ebola outbreak. Updated ${currentMonth} ${currentYear} cases and deaths.`}
        />
        <meta
          property="twitter:image"
          content="https://ebola-cases.com/socialImg.png"
        />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW="5xl" mt={35}>
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <Link href="/">
              <a>Home</a>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link href={`/countries/`}>
              <a>Countries</a>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link href={`/countries/${countryDetails.iso2}`}>
              <a>{countryDetails.name}</a>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link href={`/countries/${countryDetails.iso2}`}>
              <a>States</a>
            </Link>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <Link href="/countries">
              <a>{stateDetails.name}</a>
            </Link>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading as="h1" size="4xl">
          {stateName} {countryDetails.emoji}
        </Heading>
        <Heading as="h2" size="md">
          Ebola Outbreak: State Details
        </Heading>{" "}
        <Heading as="h2" mt={10} mb={5}>
          Ebola virus disease outbreak in {stateName}, {countryName}: case
          counts, deaths, and statistics
        </Heading>
        <Text>
          The Ebola virus is a deadly virus that causes hemorrhagic fever in
          humans and other primates. Symptoms may appear anywhere from 2 to 21
          days after contact with the virus, with an average of 8 to 10 days.
          The course of the illness typically progresses from “dry” symptoms
          initially, such as fever, aches and pains, and fatigue, and then
          progresses to “wet” symptoms, such as diarrhea and vomiting as the
          person becomes sicker.
          <br /> <br />
        </Text>
        <Text>
          This page shows data for the ebola outbreak currently taking place in{" "}
          <b>{stateName}</b>, located in the {countryName}. This outbreak is
          part of the larger outbreak taking place in {countryDetails.region},
          specifically in {countryDetails.subregion}.
          <br />
          <br />
        </Text>
        <Heading as="h2" size="sm">
          {stateName}-level data
        </Heading>
        <Text>
          At present, we do not have data specific to {stateName} ebola cases or
          deaths. However, we do have {countryName}-level data, which is
          presented below.
          <br />
          <br />
        </Text>
        <Heading as="h2" size="sm">
          {countryName}-level data
        </Heading>
        <Text>
          Based on the most recent reports available from the government in{" "}
          {countryDetails.capital}, health authorities in {countryName} have
          reported {countryNewCases.toLocaleString()} new case
          {countryNewCases == 1 ? `` : `s`} and{" "}
          {countryNewDeaths ? countryNewDeaths.toLocaleString() : 0} new death
          {countryNewDeaths == 1 ? `` : `s`}. The people of {countryName} have
          experienced {countryTotalCases.toLocaleString()} total case
          {countryTotalCases == 1 ? `` : `s`} since the start of the outbreak.
          <br />
          <br />
          You can use the charts on this page to explore the spread of ebola in{" "}
          {countryName}. Lastly, you can see how the {countryName} ebola
          situation compares with the situation globally on the{" "}
          <Link href="/">
            <a style={{ color: `${colors.rubyRed}` }}>
              Ebola-Cases.com homepage
            </a>
          </Link>
          .
        </Text>
        <Button onClick={copy} mt={5}>
          {!copied ? "Copy report URL" : "Copied link!"}
        </Button>
        <SimpleGrid columns={[1, null, 2]}>
          <GridItem w="100%" mt={10}>
            <Heading as="h3" size="sm">
              <Center mb={1}>{countryName}: Total Ebola Cases</Center>
            </Heading>
            <div style={{ minHeight: "40vh" }}>
              {countryCaseData[0] ? (
                <Line
                  data={chartDataTotalCases}
                  options={{ maintainAspectRatio: false }}
                />
              ) : (
                <Center>No cases detected yet.</Center>
              )}
            </div>
          </GridItem>
          <GridItem w="100%" mt={10}>
            <Heading as="h3" size="sm">
              <Center mb={1}>{countryName}: Ebola Cases per Million</Center>
            </Heading>
            <div style={{ minHeight: "40vh" }}>
              {countryCaseData[0] ? (
                <Line
                  data={chartDataTotalCasesPerMillion}
                  options={{ maintainAspectRatio: false }}
                />
              ) : (
                <Center>No cases detected yet.</Center>
              )}
            </div>
          </GridItem>
          <GridItem w="100%" mt={10}>
            <Heading as="h3" size="sm">
              <Center mb={1}>{countryName}: Ebola Deaths</Center>
            </Heading>
            <div style={{ minHeight: "40vh" }}>
              {countryCaseData[0] ? (
                <Line
                  data={chartDataNewDeaths}
                  options={{ maintainAspectRatio: false }}
                />
              ) : (
                <Center>No cases detected yet.</Center>
              )}
            </div>
          </GridItem>
        </SimpleGrid>
        <Text mb={5} mt={10} color={"gray.500"}>
          Source: <a href={"https://www.health.go.ug/ebola/"}>Ugandan MOH</a>.
          Last update: {Date().toLocaleString().substring(0, 16)}
        </Text>
      </Container>
    </>
  );
};

export default CountryDetails;
