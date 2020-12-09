import React from "react";

import { capitalize } from "lodash-es";
import { useTranslation } from "react-i18next";
import { openWorkspaceTab } from "../shared-utils";

import {
  Button,
  DataTable,
  DataTableSkeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow
} from "carbon-components-react";
import { Add16 } from "@carbon/icons-react";

import { createErrorHandler } from "@openmrs/esm-error-handling";
import { useCurrentPatient } from "@openmrs/esm-react-utils";

import {
  performPatientAllergySearch,
  Allergy
} from "./allergy-intolerance.resource";
import AllergyForm from "./allergy-form.component";
import EmptyState from "../../ui-components/empty-state/empty-state.component";
import ErrorState from "../../ui-components/error-state/error-state.component";
import styles from "./allergies-overview.scss";

const AllergiesOverview: React.FC<AllergiesOverviewProps> = () => {
  const { t } = useTranslation();
  const [isLoadingPatient, patient] = useCurrentPatient();
  const [allergies, setAllergies] = React.useState<Array<Allergy>>(null);
  const [error, setError] = React.useState(null);
  const displayText = t("allergyIntolerances", "allergy intolerances");
  const headerTitle = t("allergies", "Allergies");

  React.useEffect(() => {
    if (!isLoadingPatient && patient) {
      const sub = performPatientAllergySearch(
        patient.identifier[0].value
      ).subscribe(
        allergies => {
          setAllergies(allergies);
        },
        error => {
          setError(error);
          createErrorHandler();
        }
      );

      return () => sub.unsubscribe();
    }
  }, [isLoadingPatient, patient]);

  const headers = [
    {
      key: "display",
      header: t("name", "Name")
    },
    {
      key: "reactions",
      header: t("reactions", "Reactions")
    }
  ];

  const launchAllergiesForm = () => {
    openWorkspaceTab(AllergyForm, t("allergiesForm", "Allergies Form"));
  };

  const getRowItems = rows =>
    rows.map(row => ({
      ...row,
      display: row.display,
      reactions: `${row.reactionManifestations?.join(", ") || ""} ${
        row.reactionSeverity ? `(${capitalize(row.reactionSeverity)})` : ""
      }`
    }));

  const RenderAllergies = () => {
    if (allergies.length) {
      const rows = getRowItems(allergies);
      return (
        <div>
          <div className={styles.allergiesHeader}>
            <h4>{headerTitle}</h4>
            <Button
              kind="ghost"
              renderIcon={Add16}
              iconDescription="Add allergies"
              onClick={launchAllergiesForm}
            >
              Add
            </Button>
          </div>
          <TableContainer>
            <DataTable rows={rows} headers={headers} isSortable={true}>
              {({ rows, headers, getHeaderProps, getTableProps }) => (
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {headers.map(header => (
                        <TableHeader
                          {...getHeaderProps({
                            header,
                            isSortable: header.isSortable
                          })}
                        >
                          {header.header?.content ?? header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map(row => (
                      <TableRow key={row.id}>
                        {row.cells.map(cell => (
                          <TableCell key={cell.id}>
                            {cell.value?.content ?? cell.value}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </DataTable>
          </TableContainer>
        </div>
      );
    }
    return (
      <EmptyState
        displayText={displayText}
        headerTitle={headerTitle}
        launchForm={launchAllergiesForm}
      />
    );
  };

  return (
    <>
      {allergies ? (
        <RenderAllergies />
      ) : error ? (
        <ErrorState error={error} headerTitle={headerTitle} />
      ) : (
        <DataTableSkeleton />
      )}
    </>
  );
};

export default AllergiesOverview;

type AllergiesOverviewProps = { basePath: string };
