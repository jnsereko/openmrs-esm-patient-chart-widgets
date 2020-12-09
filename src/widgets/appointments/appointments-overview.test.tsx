import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { mockAppointmentsResponse } from "../../../__mocks__/appointments.mock";
import { getAppointments } from "./appointments.resource";
import AppointmentsOverview from "./appointments-overview.component";
import { openWorkspaceTab } from "../shared-utils";

const mockGetAppointments = getAppointments as jest.Mock;
const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;
const mockPatientAppointments = getAppointments as jest.Mock;

const renderAppointmentsOverview = () => {
  render(
    <BrowserRouter>
      <AppointmentsOverview basePath="/" />
    </BrowserRouter>
  );
};

jest.mock("./appointments.resource", () => ({
  getAppointments: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

describe("<AppointmentsOverview />", () => {
  beforeEach(() => {
    mockOpenWorkspaceTab.mockReset;
    mockPatientAppointments.mockReset;
    mockGetAppointments.mockReset;
  });

  it("should display an overview of the patient's appointments if present", async () => {
    mockGetAppointments.mockReturnValue(
      Promise.resolve(mockAppointmentsResponse)
    );

    renderAppointmentsOverview();

    await screen.findByText("Appointments");

    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Service Type")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("08-Mar-2020")).toBeInTheDocument();
    expect(screen.getByText("Outpatient")).toBeInTheDocument();
    expect(screen.getByText("Scheduled")).toBeInTheDocument();
    expect(screen.getByText("15-Mar-2020")).toBeInTheDocument();
    expect(screen.getByText("Inpatient")).toBeInTheDocument();
    expect(screen.getByText("Unscheduled")).toBeInTheDocument();
  });

  it("renders an empty state view when appointments data is absent", async () => {
    mockGetAppointments.mockReturnValue(Promise.resolve({ data: [] }));

    renderAppointmentsOverview();

    await screen.findByText("Appointments");

    expect(screen.getByText("Appointments")).toBeInTheDocument();

    expect(
      screen.getByText(/There are no appointments to display for this patient/)
    ).toBeInTheDocument();
  });
});
