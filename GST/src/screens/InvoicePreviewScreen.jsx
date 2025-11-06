// InvoicePreviewScreen.jsx
import React, { useState, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions, 
  Text, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  Modal,
  ScrollView,
  Animated,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { COLORS } from '../constants/colors';
import { generateInvoiceHTML } from '../Utils/Templates/StandardTemplate';

const { width, height } = Dimensions.get('window');

const InvoicePreviewScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { invoiceData } = route.params;
  
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [invoiceWatermark, setInvoiceWatermark] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // List of available invoice templates
  const invoiceTemplates = [
    {
      id: 1,
      name: "Standard Template",
      description: "Default ANU CRACKERS invoice template",
      isDefault: true,
    },
    {
      id: 2,
      name: "Professional Template", 
      description: "Clean and professional layout",
      isDefault: false,
    },
    {
      id: 3,
      name: "Compact Template",
      description: "Space optimized for thermal printers",
      isDefault: false,
    },
  ];

const htmlContent = generateInvoiceHTML({
  ...invoiceData,
  settings: {
    invoiceWatermark: invoiceWatermark, // from your state
    templateId: selectedTemplate // from your state
  }
});

  const handleGeneratePdf = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);

    try {
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
      });
      console.log('PDF generated at:', uri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          dialogTitle: 'Share Invoice PDF',
          mimeType: 'application/pdf',
        });
      } else {
        Alert.alert("Error", "Sharing is not available on this device.");
      }

    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert("Error", "Could not generate PDF invoice.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const openSettingsModal = () => {
    setShowSettingsModal(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSettingsModal = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowSettingsModal(false));
  };

  const toggleWatermark = () => {
    setInvoiceWatermark(!invoiceWatermark);
  };

  const selectTemplate = (templateId) => {
    setSelectedTemplate(templateId);
  };

  const TemplateOption = ({ template }) => (
    <TouchableOpacity
      style={[
        styles.templateOption,
        selectedTemplate === template.id && styles.templateOptionSelected
      ]}
      onPress={() => selectTemplate(template.id)}
    >
      <View style={styles.templateInfo}>
        <Text style={[
          styles.templateName,
          selectedTemplate === template.id && styles.templateNameSelected
        ]}>
          {template.name}
          {template.isDefault && (
            <Text style={styles.defaultBadge}> • Default</Text>
          )}
        </Text>
        <Text style={styles.templateDescription}>
          {template.description}
        </Text>
      </View>
      <View style={[
        styles.radioButton,
        selectedTemplate === template.id && styles.radioButtonSelected
      ]}>
        {selectedTemplate === template.id && <View style={styles.radioButtonInner} />}
      </View>
    </TouchableOpacity>
  );

  const WatermarkOption = () => (
    <View style={styles.watermarkOption}>
      <View style={styles.watermarkInfo}>
        <Text style={styles.watermarkTitle}>Watermark Logo</Text>
        <Text style={styles.watermarkDescription}>
          {invoiceWatermark 
            ? "ANU CRACKERS watermark is visible" 
            : "Watermark is hidden"
          }
        </Text>
      </View>
      <Switch
        value={invoiceWatermark}
        onValueChange={toggleWatermark}
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={invoiceWatermark ? "#f5dd4b" : "#f4f3f4"}
      />
    </View>
  );

  const Switch = ({ value, onValueChange, trackColor, thumbColor }) => (
    <TouchableOpacity
      style={[
        styles.switchContainer,
        value && styles.switchContainerOn,
        { backgroundColor: value ? trackColor?.true : trackColor?.false }
      ]}
      onPress={onValueChange}
    >
      <View style={[
        styles.switchThumb,
        value && styles.switchThumbOn,
        { backgroundColor: thumbColor }
      ]} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()} 
          style={styles.headerButton}
        >
          <FontAwesome name="arrow-left" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Invoice Preview</Text>
          <Text style={styles.headerSubtitle}>ANU CRACKERS</Text>
        </View>

        <TouchableOpacity 
          onPress={openSettingsModal}
          style={styles.settingsButton}
        >
          <MaterialIcons name="settings" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Preview Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {invoiceData.products?.length || 0}
          </Text>
          <Text style={styles.statLabel}>Items</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            ₹{invoiceData.totals?.grandTotal?.toFixed(2) || '0.00'}
          </Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <MaterialIcons 
            name="branding-watermark" 
            size={20} 
            color={invoiceWatermark ? COLORS.primary : '#ccc'} 
          />
          <Text style={styles.statLabel}>Watermark</Text>
        </View>
      </View>

      {/* WebView Preview */}
      <View style={styles.previewContainer}>
        <WebView
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={styles.webview}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading Preview...</Text>
            </View>
          )}
        />
      </View>

      {/* CTA Section */}
      <View style={styles.ctaContainer}>
        <View style={styles.ctaButtons}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={openSettingsModal}
          >
            <MaterialIcons name="design-services" size={18} color={COLORS.primary} />
            <Text style={styles.secondaryButtonText}>
              Template
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.generateButton, isGeneratingPdf && styles.generateButtonDisabled]}
            onPress={handleGeneratePdf}
            disabled={isGeneratingPdf}
          >
            {isGeneratingPdf ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <FontAwesome name="file-pdf-o" size={18} color="#fff" />
                <Text style={styles.generateButtonText}>Generate PDF</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Settings Modal */}
      <Modal
        visible={showSettingsModal}
        transparent
        animationType="fade"
        onRequestClose={closeSettingsModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContent,
              { 
                opacity: fadeAnim 
              }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Template Settings
              </Text>
              <TouchableOpacity onPress={closeSettingsModal}>
                <MaterialIcons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.settingsList}>
              {/* Template Selection */}
              <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Choose Template</Text>
                {invoiceTemplates.map((template) => (
                  <TemplateOption key={template.id} template={template} />
                ))}
              </View>

              {/* Watermark Setting */}
              <View style={styles.settingsSection}>
                <Text style={styles.sectionTitle}>Template Options</Text>
                <WatermarkOption />
              </View>

              {/* Current Settings Info */}
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Current Settings</Text>
                <Text style={styles.infoText}>
                  • Template: {invoiceTemplates.find(t => t.id === selectedTemplate)?.name}
                </Text>
                <Text style={styles.infoText}>
                  • Watermark: {invoiceWatermark ? 'ENABLED' : 'DISABLED'}
                </Text>
                <Text style={styles.infoText}>
                  • Items: {invoiceData.products?.length || 0}
                </Text>
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.04,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
    backgroundColor: '#fff',
  },
  headerButton: {
    padding: 8,
    borderRadius: 10,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  settingsButton: {
    padding: 8,
    borderRadius: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: width * 0.04,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 8,
  },
  previewContainer: {
    flex: 1,
    margin: width * 0.04,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
    borderRadius: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  ctaContainer: {
    padding: 20,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderColor,
  },
  ctaButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  generateButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginLeft: 12,
    backgroundColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  generateButtonDisabled: {
    backgroundColor: COLORS.textSecondary,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: '#fff',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  settingsList: {
    maxHeight: 500,
  },
  settingsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  templateOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 8,
    backgroundColor: '#f8fafc',
  },
  templateOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#eff6ff',
  },
  templateInfo: {
    flex: 1,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  templateNameSelected: {
    color: COLORS.primary,
  },
  templateDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  defaultBadge: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  watermarkOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  watermarkInfo: {
    flex: 1,
  },
  watermarkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  watermarkDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  switchContainer: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  switchContainerOn: {
    backgroundColor: '#81b0ff',
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f4f3f4',
  },
  switchThumbOn: {
    transform: [{ translateX: 22 }],
  },
  infoSection: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
    lineHeight: 20,
  },
});

export default InvoicePreviewScreen;