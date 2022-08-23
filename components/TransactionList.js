import { FlatList, Image, View } from "react-native"
import { Text } from "@ui-kitten/components"
import tw from "twrnc"

export function TransactionList({ data }) {
  const staticData = [
    { title: "Atlas Cafe Mocha", amount: 6.5 },
    { title: "Atlas Cafe Latte", amount: 5.5 },
    { title: "Autonomous Desk", amount: 499.99999999 },
    { title: "SF MUNI", amount: 2.5 },
    { title: "Caltrain", amount: 11.9999999999 },
    { title: "Braintrust talent", amount: 2500 },
    { title: "STEPN Shoes", amount: 9000 },
  ]
  return (
    <View style={tw`w-full`}>
      {staticData.map(({ title, amount }) => (
        <Transaction title={title} price={amount} />
      ))}
    </View>
  )
}

function Transaction({ title, price }) {
  return (
    <View style={tw`flex flex-row content-center w-full bg-white rounded-2xl p-2 my-2 `}>
      <Image
        style={tw`w-1/6 h-8 py-auto self-center`}
        source={{
          uri: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/usdc-coin-icon.png",
        }}
        resizeMode={"contain"}
      />
      <View style={tw`flex-col w-1/2 self-center`}>
        <Text style={tw`text-lg`}>{title}</Text>
        <Text style={tw`text-base`}>08/11/2022</Text>
      </View>
      <Text style={tw`w-1/3 self-center text-lg `} numberOfLines={1}>
        {price}
      </Text>
    </View>
  )
}
