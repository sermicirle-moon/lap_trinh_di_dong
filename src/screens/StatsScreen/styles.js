import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FAFBFF', 
    padding: 20 
  },
  headerTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
  statCard: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 12, 
    flex: 1, 
    marginHorizontal: 5, 
    alignItems: 'center', 
    elevation: 1 
  },
  statLabel: { 
    fontSize: 12, 
    color: '#888', 
    marginBottom: 5 
  },
  statValue: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  chartCard: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 15, 
    elevation: 1 
  },
  sectionTitle: { 
    fontSize: 12, 
    color: '#888', 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  chartValue: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
  mockChart: { 
    height: 100, 
    backgroundColor: '#E3F2FD', 
    borderRadius: 8 
  }
});