import { Reading, Bill } from '@/types';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  section: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: '#666',
  },
  value: {
    fontSize: 14,
    marginBottom: 5,
  },
});

const BillPDF = ({ reading, bill }: { reading: Reading; bill: Bill }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.title}>WeBill™ Electricity Bill</Text>
        
        <View style={styles.section}>
          <Text style={styles.label}>Meter ID</Text>
          <Text style={styles.value}>{reading.meterId}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Reading Date</Text>
          <Text style={styles.value}>{`${reading.month}/${reading.year}`}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Meter Reading</Text>
          <Text style={styles.value}>{reading.reading} kWh</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Consumption</Text>
          <Text style={styles.value}>{bill.consumption} kWh</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Amount Due</Text>
          <Text style={styles.value}>${bill.amount.toFixed(2)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Due Date</Text>
          <Text style={styles.value}>{new Date(bill.dueDate).toLocaleDateString()}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export const generateBillPDF = async (reading: Reading, bill: Bill): Promise<Blob> => {
  return new Promise((resolve) => {
    const blob = new Blob([<BillPDF reading={reading} bill={bill} />], { type: 'application/pdf' });
    resolve(blob);
  });
};

export const BillDownloadLink = ({ reading, bill }: { reading: Reading; bill: Bill }) => (
  <PDFDownloadLink
    document={<BillPDF reading={reading} bill={bill} />}
    fileName={`bill-${reading.meterId}-${reading.month}-${reading.year}.pdf`}
  >
    {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
  </PDFDownloadLink>
);