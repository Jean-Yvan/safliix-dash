import { Document, Page, Text, View, StyleSheet, Font, Image } from "@react-pdf/renderer";

type ReportRow = {
  id: string;
  name: string;
  status?: string;
  updatedAt?: string;
  owner?: string;
};

type Props = {
  title: string;
  generatedAt: string;
  generatedBy?: string;
  items: ReportRow[];
  logoUrl?: string;
};

Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7qqzv.woff2" },
    { src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7qqzv.woff2", fontWeight: 600 },
  ],
});

const styles = StyleSheet.create({
  page: { padding: 32, fontFamily: "Inter", backgroundColor: "#0f172a", color: "#e2e8f0" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  titleBlock: { flexDirection: "column", gap: 4 },
  title: { fontSize: 20, fontWeight: 600 },
  meta: { fontSize: 10, color: "#cbd5e1" },
  chip: { fontSize: 10, color: "#0ea5e9", border: "1 solid #0ea5e9", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  table: { marginTop: 12, borderRadius: 8, overflow: "hidden" },
  row: { flexDirection: "row", paddingVertical: 8, paddingHorizontal: 10, borderBottom: "1 solid #1e293b" },
  head: { backgroundColor: "#1e293b", fontSize: 10, fontWeight: 600 },
  cellId: { width: "18%", fontSize: 10 },
  cellName: { width: "38%", fontSize: 10 },
  cellStatus: { width: "18%", fontSize: 10 },
  cellDate: { width: "26%", fontSize: 10, textAlign: "right" },
  footer: { marginTop: 16, fontSize: 10, color: "#94a3b8" },
  logo: { width: 80, height: 24, objectFit: "contain" },
});

export function ReportPdf({ title, generatedAt, generatedBy = "SaFLIIX Dashboard", items, logoUrl }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.titleBlock}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.meta}>
              Généré le {generatedAt} · {generatedBy}
            </Text>
          </View>
          {logoUrl ? <Image src={logoUrl} style={styles.logo} /> : <Text style={styles.chip}>Rapport PDF</Text>}
        </View>

        <View style={[styles.row, styles.head]}>
          <Text style={styles.cellId}>ID</Text>
          <Text style={styles.cellName}>Nom</Text>
          <Text style={styles.cellStatus}>Statut</Text>
          <Text style={styles.cellDate}>Mise à jour</Text>
        </View>
        <View style={styles.table}>
          {items.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text style={styles.cellId}>{item.id}</Text>
              <Text style={styles.cellName}>{item.name}</Text>
              <Text style={styles.cellStatus}>{item.status || "N/A"}</Text>
              <Text style={styles.cellDate}>{item.updatedAt || "-"}</Text>
            </View>
          ))}
          {items.length === 0 && (
            <View style={styles.row}>
              <Text style={styles.cellName}>Aucune donnée sélectionnée</Text>
            </View>
          )}
        </View>

        <Text style={styles.footer}>Données issues de la sélection de rapports · {items.length} entrées</Text>
      </Page>
    </Document>
  );
}
