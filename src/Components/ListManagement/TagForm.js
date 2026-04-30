import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, 
  KeyboardAvoidingView, Platform, Keyboard 
} from 'react-native';
import ListColorPicker from './ListColorPicker';

export default function TagForm({ visible, mode = 'create', initialData = null, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [color, setColor] = useState('#828282');
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && initialData) {
        setName(initialData.title || '');
        setColor(initialData.color || '#828282');
      } else {
        setName('');
        setColor('#828282');
      }
    }
  }, [visible, mode, initialData]);

  const handleSave = () => {
    if (!name.trim()) {
      alert('Vui lòng nhập tên thẻ');
      return;
    }
    Keyboard.dismiss();
    setTimeout(() => {
      onSave({ title: name.trim(), color });
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
            <Text style={styles.title}>{mode === 'create' ? 'Thẻ mới' : 'Chỉnh sửa'}</Text>
            <TouchableOpacity onPress={handleSave}><Text style={styles.saveBtn}>Lưu</Text></TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.label}>Tên thẻ</Text>
              <TextInput 
                style={styles.input} 
                placeholder="VD: Quan trọng, Học tập..." 
                value={name} 
                onChangeText={setName} 
                autoFocus 
                placeholderTextColor="#C0C0C0" 
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Màu sắc đại diện</Text>
              <TouchableOpacity
                style={[styles.colorSelector, { borderColor: color }]}
                onPress={() => { Keyboard.dismiss(); setShowColorPicker(true); }}
              >
                <View style={[styles.colorPreview, { backgroundColor: color }]} />
                <Text style={styles.colorText}>Thay đổi màu thẻ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

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
  container: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cancelBtn: { fontSize: 16, color: '#999' },
  saveBtn: { fontSize: 16, fontWeight: 'bold', color: '#2D9CDB' },
  content: { padding: 20 },
  section: { marginBottom: 25 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12, fontSize: 16, color: '#333' },
  colorSelector: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: '#E0E0E0', borderRadius: 8, paddingHorizontal: 15, paddingVertical: 12 },
  colorPreview: { width: 28, height: 28, borderRadius: 6, marginRight: 12 },
  colorText: { fontSize: 16, color: '#666' },
}); 