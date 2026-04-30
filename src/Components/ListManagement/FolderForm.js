import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, 
  KeyboardAvoidingView, Platform, ScrollView, Keyboard 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ListColorPicker from './ListColorPicker'; // Đảm bảo import đúng đường dẫn

export default function FolderForm({ visible, mode = 'create', initialData = null, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#828282');
  const [icon, setIcon] = useState('folder-outline');
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && initialData) {
        setName(initialData.title || '');
        setColor(initialData.color || '#828282');
        setIcon(initialData.icon || 'folder-outline');
      } else {
        setName('');
        setColor('#828282');
        setIcon('folder-outline');
      }
    }
  }, [visible, mode, initialData]);

  const handleSave = () => {
    if (!name.trim()) {
      alert('Vui lòng nhập tên thư mục');
      return;
    }
    Keyboard.dismiss();
    setTimeout(() => {
      onSave({ title: name.trim(), color, icon });
      setName('');
    }, 150);
  };

  const handleCancel = () => {
    Keyboard.dismiss();
    onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleCancel}>
      <KeyboardAvoidingView style={styles.backdrop} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableOpacity style={{ flex: 1 }} onPress={handleCancel} />
        
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleCancel}><Text style={styles.cancelBtn}>Hủy</Text></TouchableOpacity>
            <Text style={styles.title}>{mode === 'create' ? 'Thư mục mới' : 'Chỉnh sửa'}</Text>
            <TouchableOpacity onPress={handleSave}><Text style={styles.saveBtn}>Lưu</Text></TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.label}>Tên thư mục</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Nhập tên..." 
                value={name} 
                onChangeText={setName} 
                autoFocus 
                placeholderTextColor="#C0C0C0" 
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Màu sắc</Text>
              <TouchableOpacity
                style={[styles.colorSelector, { borderColor: color }]}
                onPress={() => { Keyboard.dismiss(); setShowColorPicker(true); }}
              >
                <View style={[styles.colorPreview, { backgroundColor: color }]} />
                <Text style={styles.colorText}>Chọn màu thư mục</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Biểu tượng</Text>
              <View style={styles.iconGrid}>
                {['folder-outline', 'folder-open', 'shapes', 'archive', 'briefcase'].map((iconName) => (
                  <TouchableOpacity 
                    key={iconName} 
                    style={[styles.iconButton, icon === iconName && styles.iconButtonSelected]} 
                    onPress={() => { Keyboard.dismiss(); setIcon(iconName); }}
                  >
                    <Ionicons name={iconName} size={28} color={icon === iconName ? color : '#999'} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* HIỂN THỊ PICKER BÊN TRONG MODAL */}
      <ListColorPicker 
        visible={showColorPicker} 
        onClose={() => setShowColorPicker(false)} 
        onSelectColor={setColor} 
        currentColor={color} 
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  container: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cancelBtn: { fontSize: 16, color: '#999' },
  saveBtn: { fontSize: 16, fontWeight: 'bold', color: '#2D9CDB' },
  content: { padding: 20 },
  section: { marginBottom: 30 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, color: '#333' },
  colorSelector: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12 },
  colorPreview: { width: 28, height: 28, borderRadius: 6, marginRight: 12 },
  colorText: { fontSize: 16, color: '#666' },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  iconButton: { width: '18%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 2, borderColor: '#E0E0E0', marginBottom: 12 },
  iconButtonSelected: { borderColor: '#2D9CDB', backgroundColor: '#F0F8FF' },
});