import { View, Text, ScrollView } from "react-native";
import { BanknoteArrowUp, BanknoteArrowDown, HandCoins, ScanBarcode } from "lucide-react-native";
import SummaryCard from "../../../components/SummaryCard";

export default function Home() {
  return (
    <View className="flex-1 bg-gray-50 pt-4">
      <Text className="text-3xl font-poppins-semibold px-8 mb-4">Homepage</Text>

      <ScrollView className="w-full px-1 gap-4">
        <View className="flex gap-4">
          <View className="flex-row justify-around">
            <SummaryCard
              icon={<BanknoteArrowUp size={22} />}
              title="Total Entradas"
              value="R$ 2.546,49"
              change="5,23%"
              positive={true}
              period="Esse mês"
            />
            <SummaryCard
              icon={<BanknoteArrowDown size={22} />}
              title="Total Saídas"
              value="R$ 1.867,31"
              change="2,54%"
              positive={false}
              period="Esse mês"
            />
          </View>
          <View className="flex-row justify-around">
            <SummaryCard
              icon={<ScanBarcode size={22} />}
              title="Contas Fixas"
              value="R$ 831,99"
              change="12,20%"
              positive={true}
              period="Esse mês"
            />
            <SummaryCard
              icon={<HandCoins size={22} />}
              title="Contas a vencer"
              value="R$ 324,99"
              change="1,04%"
              positive={false}
              period="Próximos 7 dias"
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
