import React from 'react';
import { View, StyleSheet, Linking, ScrollView } from 'react-native';
import { Modal, Portal, Text, Button, Card, Divider } from 'react-native-paper';
import { Colors } from '../constants/Colors';
import { VersionInfo } from '../types';

interface UpdateDialogProps {
  visible: boolean;
  updateInfo: VersionInfo | null;
  onDismiss: () => void;
}

export function UpdateDialog({ visible, updateInfo, onDismiss }: UpdateDialogProps) {
  if (!updateInfo) return null;

  const handleDownload = async () => {
    try {
      await Linking.openURL(updateInfo.downloadUrl);
    } catch (error) {
      console.error('打开下载链接失败:', error);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modal}
      >
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="headlineSmall" style={styles.title}>
              {updateInfo.forceUpdate ? '强制更新' : '发现新版本'}
            </Text>
            
            <View style={styles.versionInfo}>
              <Text variant="titleMedium" style={styles.version}>
                v{updateInfo.version}
              </Text>
              {updateInfo.forceUpdate && (
                <View style={styles.forceTag}>
                  <Text style={styles.forceTagText}>必须更新</Text>
                </View>
              )}
            </View>

            <Divider style={styles.divider} />

            <ScrollView style={styles.releaseNotes}>
              <Text variant="bodyMedium" style={styles.releaseNotesText}>
                {updateInfo.releaseNotes || '暂无更新说明'}
              </Text>
            </ScrollView>
          </Card.Content>

          <Card.Actions style={styles.actions}>
            {!updateInfo.forceUpdate && (
              <Button 
                mode="outlined" 
                onPress={onDismiss}
                style={styles.button}
              >
                稍后再说
              </Button>
            )}
            <Button 
              mode="contained" 
              onPress={handleDownload}
              style={styles.button}
              buttonColor={Colors.primary}
            >
              {updateInfo.forceUpdate ? '立即更新' : '下载更新'}
            </Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modal: {
    marginHorizontal: 20,
  },
  card: {
    borderRadius: 16,
  },
  title: {
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  versionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  version: {
    color: Colors.primary,
    fontWeight: '600',
  },
  forceTag: {
    backgroundColor: Colors.error,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  forceTagText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    marginVertical: 16,
  },
  releaseNotes: {
    maxHeight: 150,
  },
  releaseNotesText: {
    color: Colors.textLight,
    lineHeight: 22,
  },
  actions: {
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  button: {
    flex: 1,
  },
});