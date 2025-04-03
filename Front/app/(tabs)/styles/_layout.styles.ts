import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  logo: {
    width: 50,
    height: 50,
  },
  menuButton: {
    marginLeft: "auto",
  },
  menuDropdown: {
    position: "absolute",
    top: 60,
    right: 10,
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 5,
    zIndex: 999,
    elevation: 5,
  },
  menuItem: {
    fontSize: 16,
    paddingVertical: 5,
    color: "#333",
  },
  content: {
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#DDD",
    padding: 1,
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#FFF",
  },

  menuItemContainer: {
    alignItems: "center", // Centraliza os itens na vertical
    justifyContent: "center", // Garante que tudo fique centralizado
    padding: 10,
  },
  
});

export default styles;
