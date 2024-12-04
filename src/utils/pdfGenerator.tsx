import React from 'react';
import { Reading, Bill } from '@/types';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: '#666666',
  },
  value: {
    fontSize: 14,
    marginBottom: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666666',
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
          <Text style={styles.value}>{reading.meter_id}</Text>
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
          <Text style={styles.value}>{new Date(bill.due_date).toLocaleDateString()}</Text>
        </View>

        <View style={styles.footer}>
          <Text>Generated on {new Date().toLocaleDateString()}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export const BillViewer: React.FC<BillPDFProps> = (props) => (
  <PDFViewer style={{ width: '100%', height: '500px' }}>
    <BillPDF {...props} />
  </PDFViewer>
);

export const BillDownloadLink: React.FC<BillPDFProps & { className?: string }> = ({ className, ...props }) => (
  <PDFDownloadLink
    document={<BillPDF {...props} />}
    fileName={`bill-${props.reading.meter_id}-${props.reading.month}-${props.reading.year}.pdf`}
    className={className}
  >
    {({ loading }) => (
      <span>{loading ? 'Generating PDF...' : 'Download PDF'}</span>
    )}
  </PDFDownloadLink>
);