/**
 * LIST FORM - Form thêm/sửa danh sách
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ListColorPicker from './ListColorPicker';

export default function ListForm({
  visible,
  mode = 'create', // 'create' or 'edit'
  initialData = null,
  onSave,
  onCancel,
}) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#2D9CDB');
  const [icon, setIcon] = useState('list-outline');
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Set default values on open
  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && initialData) {
        setName(initialData.title || '');
        setColor(initialData.color || '#2D9CDB');
        setIcon(initialData.icon || 'list-outline');
      } else {
        setName('');
        setColor('#2D9CDB');
        setIcon('list-outline');
      }
    }
  }, [visible, mode, initialData]);

  const handleSave = () => {
    if (!name.trim()) {
      alert('Vui lòng nhập tên danh sách');
      return;
    }

    onSave({
      title: name.trim(),
      color,
      icon,
    });

    setName('');
    setColor('#2D9CDB');
    setIcon('list-outline');
  };

  const handleCancel = () => {
    setName('');
    setColor('#2D9CDB');
    setIcon('list-outline');
    onCancel();
  };

  return (
    <>
      <Modal visible={visible} transparent animationType="slide" onRequestClose={handleCancel}>
        <KeyboardAvoidingView
          style={styles.backdrop}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <TouchableOpacity style={{ flex: 1 }} onPress={handleCancel} />

          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleCancel}>
                <Text style={styles.cancelBtn}>Hủy</Text>
              </TouchableOpacity>
              <Text style={styles.title}>
                {mode === 'create' ? 'Danh sách mới' : 'Chỉnh sửa'}
              </Text>
              <TouchableOpacity onPress={handleSave}>
                <Text style={styles.saveBtn}>Lưu</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {/* Tên danh sách */}
              <View style={styles.section}>
                <Text style={styles.label}>Tên</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nhập tên danh sách..."
                  value={name}
                  onChangeText={setName}
                  autoFocus
                  placeholderTextColor="#C0C0C0"
                />
              </View>

              {/* Màu sắc */}
              <View style={styles.section}>
                <Text style={styles.label}>Màu sắc</Text>
                <TouchableOpacity
                  style={[styles.colorSelector, { borderColor: color }]}
                  onPress={() => setShowColorPicker(true)}
                >
                  <View
                    style={[styles.colorPreview, { backgroundColor: color }]}
                  />
                  <Text style={styles.colorText}>Chọn màu</Text>
                </TouchableOpacity>
              </View>

              {/* Icon */}
              <View style={styles.section}>
                <Text style={styles.label}>Biểu tượng</Text>
                <View style={styles.iconGrid}>
                  {['list-outline', 'document', 'folder-outline', 'star-outline', 'heart-outline'].map((iconName) => (
                    <TouchableOpacity
                      key={iconName}
                      style={[
                        styles.iconButton,
                        icon === iconName && styles.iconButtonSelected,
                      ]}
                      onPress={() => setIcon(iconName)}
                    >
                      <Ionicons name={iconName} size={28} color={icon === iconName ? color : '#999'} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <ListColorPicker
        visible={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        onSelectColor={setColor}
        currentColor={color}
      />
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cancelBtn: {
    fontSize: 16,
    color: '#999',
  },
  saveBtn: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2D9CDB',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  colorSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  colorPreview: {
    width: 28,
    height: 28,
    borderRadius: 6,
    marginRight: 12,
  },
  colorText: {
    fontSize: 16,
    color: '#666',
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: '18%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginBottom: 12,
  },
  iconButtonSelected: {
    borderColor: '#2D9CDB',
    backgroundColor: '#F0F8FF',
  },
});
