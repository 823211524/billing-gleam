import { Reading, Bill } from '@/types';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import React from 'react';

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

interface BillPDFProps {
  reading: Reading;
  bill: Bill;
}

const BillPDF: React.FC<BillPDFProps> = ({ reading, bill }) => (
  <Document>
    <Page style={styles.page}>
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

export const BillDownloadLink: React.FC<BillPDFProps> = ({ reading, bill }) => (
  <PDFDownloadLink
    document={<BillPDF reading={reading} bill={bill} />}
    fileName={`bill-${reading.meterId}-${reading.month}-${reading.year}.pdf`}
  >
    {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
  </PDFDownloadLink>
);