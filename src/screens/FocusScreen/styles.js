import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 20, 
    alignItems: 'center' 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '600' 
  },
  content: { 
    flex: 1, 
    alignItems: 'center', 
    paddingTop: 20 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#1A1A1A' 
  },
  tag: { 
    backgroundColor: '#E3F2FD', 
    paddingHorizontal: 15, 
    paddingVertical: 5, 
    borderRadius: 20, 
    marginTop: 10 
  },
  tagText: { 
    color: '#2D9CDB', 
    fontWeight: '600' 
  },
  timerContainer: { 
    marginVertical: 40 
  },
  timerCircle: { 
    width: 250, 
    height: 250, 
    borderRadius: 125, 
    borderWidth: 8, 
    borderColor: '#2D9CDB', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  timeText: { 
    fontSize: 50, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  subText: { 
    fontSize: 12, 
    color: '#888', 
    marginTop: 5, 
    letterSpacing: 1 
  },
  startButton: { 
    flexDirection: 'row', 
    backgroundColor: '#2D9CDB', 
    paddingVertical: 15, 
    paddingHorizontal: 60, 
    borderRadius: 30, 
    alignItems: 'center' 
  },
  startButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginLeft: 10 
  },
  optionsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    width: '80%', 
    marginTop: 40 
  },
  optionItem: { 
    alignItems: 'center' 
  },
  optionText: { 
    color: '#666', 
    fontSize: 12, 
    marginTop: 5 
  },
  quote: { 
    color: '#aaa', 
    fontStyle: 'italic', 
    marginTop: 40, 
    fontSize: 12 
  }
});