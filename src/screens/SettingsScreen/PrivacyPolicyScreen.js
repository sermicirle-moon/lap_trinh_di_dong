import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PrivacyPolicyScreen({ navigation }) {
  const PolicyItem = ({ icon, title, content }) => (
    <View style={styles.policyItem}>
      <View style={styles.policyHeader}>
        <Ionicons name={icon} size={20} color="#2D9CDB" />
        <Text style={styles.policyTitle}>{title}</Text>
      </View>
      <Text style={styles.policyContent}>{content}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.lastUpdated}>Effective date: October 24, 2023</Text>
        
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Your Data Sovereignty</Text>
          <Text style={styles.heroDesc}>
            At our company, we believe privacy is a fundamental human right. This policy outlines how we protect your information under the principle: you handle your tasks, we handle your privacy.
          </Text>
        </View>

        <PolicyItem 
          icon="shield-checkmark-outline"
          title="01. Data Collection"
          content="We collect information that you provide directly to us, such as your name, email address, and task data. We also collect usage data to improve your experience."
        />

        <PolicyItem 
          icon="eye-off-outline"
          title="02. How We Use Your Data"
          content="Your data is used to provide, maintain, and improve our services, including personalizing your dashboard and ensuring security against unauthorized access."
        />

        <PolicyItem 
          icon="share-social-outline"
          title="03. Third-Party Sharing"
          content="We do not sell your personal data. We only share information with trusted service providers who assist us in operating our platform, subject to strict confidentiality."
        />

        <PolicyItem 
          icon="key-outline"
          title="04. Your Privacy Rights"
          content="Depending on your location, you have the right to access, correct, or delete your personal data. You can export your data at any time via your settings."
        />

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Have questions about how we handle your data or want to exercise your rights?
          </Text>
          <TouchableOpacity style={styles.btnSecondary}>
            <Text style={styles.btnSecondaryText}>PRIVACY POLICY (TOS) PRO</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FE' },
  header: { backgroundColor: '#FFF', flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#2D9CDB' },
  scrollContent: { padding: 20 },
  lastUpdated: { fontSize: 12, color: '#999', marginBottom: 15 },
  heroSection: { backgroundColor: '#FFF', padding: 20, borderRadius: 15, marginBottom: 25, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  heroTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  heroDesc: { fontSize: 14, color: '#666', lineHeight: 22 },
  policyItem: { marginBottom: 25 },
  policyHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  policyTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginLeft: 10 },
  policyContent: { fontSize: 14, color: '#666', lineHeight: 22, paddingLeft: 30 },
  infoBox: { backgroundColor: '#E3F2FD', padding: 20, borderRadius: 15, alignItems: 'center', marginTop: 10, marginBottom: 30 },
  infoText: { textAlign: 'center', color: '#333', marginBottom: 15, lineHeight: 20 },
  btnSecondary: { backgroundColor: '#2D9CDB', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 25 },
  btnSecondaryText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 }
});