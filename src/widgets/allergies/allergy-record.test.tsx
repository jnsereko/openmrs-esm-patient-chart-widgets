import React from "react";
import { BrowserRouter, match, useRouteMatch } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { of } from "rxjs/internal/observable/of";

import { fetchAllergyByUuid } from "./allergy-intolerance.resource";
import AllergyRecord from "./allergy-record.component";
import { mockPatientAllergy } from "../../../__mocks__/allergies.mock";

const mockUseRouteMatch = useRouteMatch as jest.Mock;
const mockFetchPatientAllergy = fetchAllergyByUuid as jest.Mock;

jest.mock("./allergy-intolerance.resource", () => ({
  fetchAllergyByUuid: jest.fn()
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useRouteMatch: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

describe("<AllergyRecord />", () => {
  let match: match = {
    params: { allergyUuid: "4ef4abef-57b3-4df0-b5c1-41c763e34965" },
    isExact: false,
    path: "/",
    url: "/"
  };

  beforeEach(() => {
    mockFetchPatientAllergy.mockReset;
  });

  it("displays detailed information about the selected allergy", async () => {
    mockUseRouteMatch.mockReturnValue(match);
    mockFetchPatientAllergy.mockReturnValue(of(mockPatientAllergy));

    render(
      <BrowserRouter>
        <AllergyRecord />
      </BrowserRouter>
    );

    await screen.findByText("Allergy");

    expect(screen.getByText("Allergy")).toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("ACE inhibitors")).toBeInTheDocument();
    expect(screen.getByText("Severity")).toBeInTheDocument();
    expect(screen.getByText("Reaction")).toBeInTheDocument();
    expect(screen.getByText("Onset Date")).toBeInTheDocument();
    expect(screen.getByText("severe")).toBeInTheDocument();
    expect(screen.getByText("Apr-2020")).toBeInTheDocument();
    expect(screen.getByText("Comments")).toBeInTheDocument();
    expect(screen.getByText("Severe reaction")).toBeInTheDocument();
    expect(screen.getByText("Details")).toBeInTheDocument();
    expect(screen.getByText("Last updated")).toBeInTheDocument();
    expect(screen.getByText("Last updated by")).toBeInTheDocument();
    expect(screen.getByText("Last updated location")).toBeInTheDocument();
    expect(screen.getByText("02-Apr-2020")).toBeInTheDocument();
    expect(screen.getByText("JJ Dick")).toBeInTheDocument();
    expect(screen.getByText("-")).toBeInTheDocument();
  });
});
