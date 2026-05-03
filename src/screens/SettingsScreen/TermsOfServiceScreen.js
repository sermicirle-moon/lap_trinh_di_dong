import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TermsOfServiceScreen({ navigation }) {
  const Section = ({ number, title, content }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        <Text style={styles.sectionNumber}>{number}. </Text>
        {title}
      </Text>
      <Text style={styles.sectionContent}>{content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.mainTitle}>Legal Agreements</Text>
        <Text style={styles.lastUpdated}>Last Updated: October 24, 2023</Text>

        <Section 
          number="01" 
          title="ACCEPTANCE OF TERMS" 
          content="By accessing or using the Taskade applications, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site."
        />

        <Section 
          number="02" 
          title="USER CONDUCT" 
          content="Users are expected to maintain professional conduct. Prohibited activities include but are not limited to: hacking, attempting to interfere with service integrity, or using the service for any illegal or unauthorized purpose."
        />

        <Section 
          number="03" 
          title="ACCOUNT RESPONSIBILITIES" 
          content="You are responsible for maintaining the confidentiality of your account and password, and for restricting access to your computer and/or mobile. You agree to accept responsibility for any and all activities that occur under your account."
        />

        <Section 
          number="04" 
          title="LIMITATION OF LIABILITY" 
          content="In no event shall the company, nor its directors, employees, or partners, be liable for any indirect, incidental, special, or consequential damages resulting from your use or inability to use the service."
        />

        <View style={styles.footerBrand}>
          <Text style={styles.brandText}>Committed to your growth.</Text>
        </View>

        <TouchableOpacity style={styles.btnAgree}>
          <Text style={styles.btnAgreeText}>I AGREE WITH YOUR TERMS</Text>
        </TouchableOpacity>

        <View style={styles.contactInfo}>
          <Text style={styles.contactLabel}>Questions? Contact: <Text style={styles.link}>legal@yourAppName.com</Text></Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D9CDB' },
  scrollContent: { padding: 20 },
  mainTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  lastUpdated: { fontSize: 13, color: '#999', marginBottom: 30, marginTop: 5 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 8, textTransform: 'uppercase' },
  sectionNumber: { color: '#2D9CDB' },
  sectionContent: { fontSize: 14, color: '#666', lineHeight: 20 },
  footerBrand: { alignItems: 'center', marginTop: 20, marginBottom: 20 },
  brandText: { fontSize: 16, fontStyle: 'italic', color: '#333', fontWeight: '500' },
  btnAgree: { backgroundColor: '#2D9CDB', height: 55, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  btnAgreeText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  contactInfo: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
  contactLabel: { fontSize: 13, color: '#666' },
  link: { color: '#2D9CDB', fontWeight: '500' }
});