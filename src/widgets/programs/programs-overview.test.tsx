import React from "react";

import { of } from "rxjs/internal/observable/of";
import { BrowserRouter } from "react-router-dom";
import { render, screen, fireEvent } from "@testing-library/react";

import { mockEnrolledProgramsResponse } from "../../../__mocks__/programs.mock";
import ProgramsForm from "../programs/programs-form.component";
import ProgramsOverview from "./programs-overview.component";
import { fetchActiveEnrollments } from "./programs.resource";
import { openWorkspaceTab } from "../shared-utils";

const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;
const mockFetchActiveEnrollments = fetchActiveEnrollments as jest.Mock;

jest.mock("./programs.resource", () => ({
  fetchActiveEnrollments: jest.fn()
}));

jest.mock("@openmrs/esm-api", () => ({
  useCurrentPatient: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

describe("<ProgramsOverview />", () => {
  beforeEach(() => {
    mockOpenWorkspaceTab.mockReset;
    mockFetchActiveEnrollments.mockReset;
  });

  it("should display the patient's program enrollments", async () => {
    mockFetchActiveEnrollments.mockReturnValue(
      of(mockEnrolledProgramsResponse)
    );

    render(
      <BrowserRouter>
        <ProgramsOverview basePath="/" />
      </BrowserRouter>
    );

    await screen.findByRole("heading", { name: /Care Programs/i });

    expect(screen.getByText(/Care Programs/i)).toBeInTheDocument();
    const addBtn = screen.getByRole("button", { name: "Add" });
    expect(addBtn).toBeInTheDocument();
    expect(screen.getAllByText(/Active Programs/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/Date enrolled/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/HIV Care and Treatment/i)[0]).toBeInTheDocument();

    // Clicking "Add" launches workspace tab
    fireEvent.click(addBtn);
    expect(mockOpenWorkspaceTab).toHaveBeenCalled();
    expect(mockOpenWorkspaceTab).toHaveBeenCalledWith(
      ProgramsForm,
      "Programs form"
    );
  });

  it("renders an empty state view when conditions data is absent", async () => {
    mockFetchActiveEnrollments.mockReturnValue(of([]));

    render(
      <BrowserRouter>
        <ProgramsOverview basePath="/" />
      </BrowserRouter>
    );

    await screen.findByRole("heading", { name: /Care Programs/i });

    expect(screen.getByText(/Care Programs/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /There are no program enrollments to display for this patient/
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/Record program enrollments/)).toBeInTheDocument();
  });
});
