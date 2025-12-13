import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

export default function SalesInvoiceFormPage({ mode }) {
  const nav = useNavigate();
  const { id } = useParams();

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        {mode === "create" ? "New Sales Invoice" : "Edit Sales Invoice"}
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Mode: <b>{mode}</b>
            <br />
            Invoice ID: <b>{id ?? "N/A"}</b>
          </Typography>

          <Button variant="outlined" onClick={() => nav("/sales-invoices")}>
            Back to List
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
