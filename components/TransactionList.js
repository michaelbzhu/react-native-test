import { FlatList, Image, View } from "react-native"
import { Text } from "@ui-kitten/components"
import tw from "twrnc"

export function TransactionList({ data }) {
  return (
    <FlatList
      style={tw`w-full`}
      data={[{ title: "tx1" }, { title: "tx2" }, { title: "tx3" }]}
      renderItem={({ item }) => <Transaction style={tw`flex w-full bg-white rounded-2xl`} title={item.title} />}
    />
  )
}

function Transaction({ title }) {
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
        1.2000000000
      </Text>
    </View>
  )
}
