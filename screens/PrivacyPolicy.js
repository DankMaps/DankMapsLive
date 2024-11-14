// src/screens/PrivacyPolicy.js

import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Text } from 'react-native-paper';
import TopBar from '../components/TopBar';

const PrivacyPolicy = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar title="Privacy Policy" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>
          www.dankmaps.co.za - Section 21 Compliant - Not a manufacturer - Not a distributor
        </Text>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.subHeader}>DankMaps (Pty) Ltd</Text>
        <Text style={styles.effectiveDate}>Effective Date: 10 November 2024</Text>

        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.content}>
          DankMaps (Pty) Ltd ("DankMaps," "we," "us," or "our") is committed to safeguarding your privacy rights in accordance with the Protection of Personal Information Act ("POPIA") of South Africa (Act No. 4 of 2013). This Privacy Policy outlines how we collect, use, store, disclose, and protect your personal information when you use our mobile application and website ("Service").
        </Text>

        <Text style={styles.sectionTitle}>2. Legal Basis for Processing</Text>
        <Text style={styles.content}>
          We process your personal information as required by POPIA, with specific reference to Sections 8, 9, 10, and 11, which cover accountability, processing limitations, purpose specification, and information quality. Processing of personal information is conducted lawfully and minimally, and only for explicit and legitimate purposes related to our Service.
        </Text>

        <Text style={styles.sectionTitle}>3. Information We Collect</Text>
        <Text style={styles.content}>
          Our data collection practices are guided by Sections 12–18 of POPIA, ensuring the collection is reasonable and necessary.
        </Text>
        <Text style={styles.bulletPoint}>• Personal Information: This includes, but is not limited to, name, email address, phone number, age, location, and other identifiable data.</Text>
        <Text style={styles.bulletPoint}>• Device Information: Technical details such as IP address, browser type, operating system, device identifier, and other data to improve our Service.</Text>
        <Text style={styles.bulletPoint}>• Usage Data: Information on interactions within our Service, search queries, user preferences, and app analytics to enhance user experience.</Text>

        <Text style={styles.sectionTitle}>4. Purposes for Processing</Text>
        <Text style={styles.content}>
          We collect and process personal information only as necessary for the following purposes:
        </Text>
        <Text style={styles.header}>
          www.dankmaps.co.za - Section 21 Compliant - Not a manufacturer - Not a distributor
        </Text>
        <Text style={styles.content}>
          DankMaps (Pty) Ltd
        </Text>
        <Text style={styles.bulletPoint}>• To operate and improve our Service, as mandated by Section 13(1) of POPIA, ensuring legitimate processing within the bounds of user expectations.</Text>
        <Text style={styles.bulletPoint}>• To communicate with users, including sending updates or responding to inquiries.</Text>
        <Text style={styles.bulletPoint}>• For research, data analytics, and to understand Service usage patterns.</Text>
        <Text style={styles.bulletPoint}>• To comply with legal and regulatory requirements.</Text>

        <Text style={styles.sectionTitle}>5. Legal Requirements and Lawful Disclosure</Text>
        <Text style={styles.content}>
          In compliance with Section 15 of POPIA, we may disclose personal information when:
        </Text>
        <Text style={styles.bulletPoint}>• Required by law (e.g., responding to court orders, law enforcement requests).</Text>
        <Text style={styles.bulletPoint}>• Necessary for legal proceedings or fraud prevention.</Text>
        <Text style={styles.bulletPoint}>• You provide explicit consent for such disclosure.</Text>

        <Text style={styles.sectionTitle}>6. Security Measures</Text>
        <Text style={styles.content}>
          In accordance with Section 19 of POPIA, we have implemented reasonable technical and organizational security measures to protect personal information against loss, damage, unauthorized access, or unlawful processing. Security practices include encryption, data minimization, and access control.
        </Text>

        <Text style={styles.sectionTitle}>7. Data Retention</Text>
        <Text style={styles.content}>
          Per Section 14 of POPIA, we retain your data only as long as necessary for the purposes outlined. Afterward, personal information will be securely deleted, de-identified, or archived as required by law.
        </Text>

        <Text style={styles.sectionTitle}>8. Your Rights as a Data Subject</Text>
        <Text style={styles.content}>
          POPIA provides you with the following rights, which you may exercise by contacting us directly:
        </Text>
        <Text style={styles.bulletPoint}>• Access: You have the right to access your personal information we hold, as provided by Section 23 of POPIA.</Text>
        <Text style={styles.header}>
          www.dankmaps.co.za - Section 21 Compliant - Not a manufacturer - Not a distributor
        </Text>
        <Text style={styles.bulletPoint}>• Correction/Deletion: You have the right to request the correction or deletion of inaccurate or outdated information per Section 24.</Text>
        <Text style={styles.bulletPoint}>• Objection to Processing: You may object to the processing of your personal information under certain conditions, as specified in Section 11(3).</Text>
        <Text style={styles.bulletPoint}>• Data Portability: Where applicable, you may request a copy of your personal information in a structured, commonly used format.</Text>

        <Text style={styles.sectionTitle}>9. Cookies and Tracking Technologies</Text>
        <Text style={styles.content}>
          We use cookies and other tracking technologies as authorized by Section 18 of POPIA to improve your user experience and gather analytics. You may control cookie preferences through your browser settings.
        </Text>

        <Text style={styles.sectionTitle}>10. International Data Transfers</Text>
        <Text style={styles.content}>
          We may transfer your personal information to jurisdictions outside South Africa for storage or processing. In such cases, we comply with Section 72 of POPIA by ensuring the recipient jurisdiction has adequate data protection measures, or by implementing additional safeguards.
        </Text>

        <Text style={styles.sectionTitle}>11. Amendments to This Privacy Policy</Text>
        <Text style={styles.content}>
          We reserve the right to amend this Privacy Policy at any time, with updates effective upon posting to our website or app. We will notify you of significant changes as per Section 18(2) of POPIA.
        </Text>

        <Text style={styles.sectionTitle}>12. Contact Us</Text>
        <Text style={styles.content}>
          For any questions regarding this Privacy Policy or to exercise your data rights, please contact us at:
        </Text>
        <Text style={styles.contactInfo}>Email: info@dankmaps.co.za, admin@dankmaps.co.za</Text>
        <Text style={styles.contactInfo}>Address: 152B Justin Crescent, Eldoraigne, Centurion, 0157, South Africa.</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    padding: 20,
  },
  header: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
    textAlign: 'center',
  },
  effectiveDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 10,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginLeft: 10,
    marginBottom: 5,
  },
  contactInfo: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 5,
  },
});

export default PrivacyPolicy;
