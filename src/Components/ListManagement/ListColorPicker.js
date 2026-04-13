/**
 * LIST COLOR PICKER
 * Component chọn màu sắc cho list/folder (Kiểu TickTick)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const COLORS = [
  '#2D9CDB', // Xanh (Blue)
  '#27AE60', // Xanh lá (Green)
  '#F2994A', // Cam (Orange)
  '#EB5757', // Đỏ (Red)
  '#9B51E0', // Tím (Purple)
  '#50E3C2', // Cyan
  '#F5A623', // Vàng (Gold)
  '#828282', // Xám (Gray)
];

export default function ListColorPicker({ visible, onClose, onSelectColor, currentColor }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={onClose}
      />
      
      <View style={styles.container}>
        <Text style={styles.title}>Chọn màu</Text>
        
        <View style={styles.colorGrid}>
          {COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorButton,
                { backgroundColor: color },
                currentColor === color && styles.colorButtonSelected,
              ]}
              onPress={() => {
                onSelectColor(color);
                onClose();
              }}
            />
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  colorButton: {
    width: '22%',
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorButtonSelected: {
    borderColor: '#333',
  },
});
