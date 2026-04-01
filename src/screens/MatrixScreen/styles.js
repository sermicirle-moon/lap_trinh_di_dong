import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    padding: 20 
  },
  headerTitle: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    marginTop: 10 
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
    marginBottom: 15 
  },
  boxTitle: { 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  boxSubtitle: { 
    fontSize: 12, 
    backgroundColor: '#f4f4f4', 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 10 
  },
  taskItem: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  radio: { 
    width: 18, 
    height: 18, 
    borderRadius: 9, 
    borderWidth: 1.5, 
    borderColor: '#ccc', 
    marginRight: 10 
  },
  taskText: { 
    fontSize: 14, 
    color: '#333' 
  }
});