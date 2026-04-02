import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FAFBFF', 
    padding: 20 
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    marginTop: 10,
    color: '#333'
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    outlineStyle: 'none' // Dành cho Web không bị viền đen khi gõ
  },
  scroll: { 
    flex: 1 
  },
  box: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 15, 
    borderLeftWidth: 5, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 5, 
    elevation: 2 
  },
  boxHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 15 
  },
  boxTitle: { 
    fontSize: 16, 
    fontWeight: 'bold',
    marginBottom: 4
  },
  boxSubtitle: { 
    fontSize: 12, 
    backgroundColor: '#f4f4f4', 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 10,
    alignSelf: 'flex-start',
    overflow: 'hidden'
  },
  taskItem: { 
    flexDirection: 'row', 
    alignItems: 'center',
    marginBottom: 10
  },
  radio: { 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    borderWidth: 2, 
    borderColor: '#ccc', 
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  taskText: { 
    fontSize: 15, 
    color: '#333',
    flex: 1
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#A0A0A0'
  },
  deleteBtn: {
    padding: 5
  }
});