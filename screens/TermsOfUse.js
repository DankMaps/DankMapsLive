// src/screens/TermsOfUse.js

import React from 'react';
import { ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { Text } from 'react-native-paper';
import TopBar from '../components/TopBar';

const TermsOfUse = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <TopBar title="Terms of Use" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>
          www.dankmaps.co.za - Section 21 Compliant - Not a manufacturer - Not a distributor
        </Text>
        <Text style={styles.title}>Terms of Use</Text>
        <Text style={styles.subHeader}>DankMaps (Pty) Ltd</Text>
        <Text style={styles.effectiveDate}>Effective Date: 10 November 2024</Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.content}>
          By using DankMaps’ mobile application and website ("Service"), you acknowledge and accept these Terms of Use, which form a legally binding agreement. If you disagree with any part, please discontinue use of the Service.
        </Text>

        <Text style={styles.sectionTitle}>2. Eligibility</Text>
        <Text style={styles.content}>
          To comply with South African legislation concerning cannabis-related content and age restrictions, this Service is intended strictly for individuals 18 years or older.
        </Text>

        <Text style={styles.sectionTitle}>3. User Responsibilities and Conduct</Text>
        <Text style={styles.content}>
          You agree to use the Service lawfully and ethically, in line with applicable South African laws, including but not limited to the Cannabis for Private Purposes Bill and consumer protection regulations.
        </Text>
        <Text style={styles.bulletPoint}>• You must not attempt to harm, exploit, or disrupt the Service.</Text>
        <Text style={styles.bulletPoint}>
          • Unauthorized access, including "hacking" or "phishing" attempts, is strictly prohibited under the Electronic Communications and Transactions Act (ECTA) (Act No. 25 of 2002), Sections 86 and 87.
        </Text>
        <Text style={styles.bulletPoint}>
          • You may not submit or share misleading, defamatory, or illegal content.
        </Text>

        <Text style={styles.sectionTitle}>4. User Content</Text>
        <Text style={styles.content}>
          Any content shared by you on the Service, including comments, images, and other materials, grants DankMaps a non-exclusive, royalty-free, worldwide license to use and display this content. Content must not violate Section 89 of ECTA or any intellectual property laws.
        </Text>

        <Text style={styles.sectionTitle}>5. Intellectual Property</Text>
        <Text style={styles.content}>
          All content and intellectual property within the Service, including trademarks, logos, images, and text, are owned by DankMaps or our licensors. Unauthorized use is
        </Text>
        <Text style={styles.header}>
          www.dankmaps.co.za - Section 21 Compliant - Not a manufacturer - Not a distributor
        </Text>
        <Text style={styles.content}>
          prohibited under the Copyright Act (Act No. 98 of 1978) and related South African IP laws.
        </Text>

        <Text style={styles.sectionTitle}>6. Privacy and Data Collection</Text>
        <Text style={styles.content}>
          Your privacy is critically important to us. Please refer to our Privacy Policy for details on how we handle and process personal information in compliance with POPIA.
        </Text>

        <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
        <Text style={styles.content}>
          DankMaps, to the fullest extent permissible under South African law, shall not be held liable for:
        </Text>
        <Text style={styles.bulletPoint}>• Any direct, indirect, or incidental damages arising from your use of the Service.</Text>
        <Text style={styles.bulletPoint}>• Any inaccuracies or omissions in the content presented.</Text>
        <Text style={styles.content}>
          As stipulated in Section 43(1) of ECTA, our liability for direct damages will be limited to the fees paid by you, if any, for using the Service.
        </Text>

        <Text style={styles.sectionTitle}>8. Indemnification</Text>
        <Text style={styles.content}>
          By using the Service, you agree to indemnify and hold harmless DankMaps, its directors, employees, and affiliates from claims, liabilities, damages, or expenses arising from your breach of these Terms, any unlawful conduct, or any unauthorized use of the Service.
        </Text>

        <Text style={styles.sectionTitle}>9. Termination of Use</Text>
        <Text style={styles.content}>
          DankMaps reserves the right to terminate or suspend your account or access to the Service for violations of these Terms or any applicable laws without prior notice.
        </Text>

        <Text style={styles.sectionTitle}>10. Governing Law and Dispute Resolution</Text>
        <Text style={styles.content}>
          These Terms of Use are governed by South African law. Any disputes or claims arising out of or in connection with these Terms shall be resolved exclusively by the courts of South Africa. Alternative dispute resolution options may be available under Section 49 of the Consumer Protection Act.
        </Text>

        <Text style={styles.sectionTitle}>11. Modification of Terms</Text>
        <Text style={styles.header}>
          www.dankmaps.co.za - Section 21 Compliant - Not a manufacturer - Not a distributor
        </Text>
        <Text style={styles.content}>
          DankMaps (Pty) Ltd reserves the right to modify these Terms of Use at any time. Changes will be communicated through the Service or by email if you have provided one. Continued use of the Service following changes signifies your acceptance of revised Terms.
        </Text>

        <Text style={styles.sectionTitle}>12. Disclaimers</Text>
        <Text style={styles.content}>
          While we strive to maintain the accuracy of information provided, we make no warranties regarding the completeness or reliability of any information on the Service. This disclaimer is in line with Section 19 of the Consumer Protection Act.
        </Text>

        <Text style={styles.sectionTitle}>13. Contact Information</Text>
        <Text style={styles.content}>
          For questions or concerns regarding these Terms of Use, please contact us at:
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

export default TermsOfUse;
