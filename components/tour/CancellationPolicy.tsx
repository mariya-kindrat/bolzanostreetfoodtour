import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { STANDARD_CANCELLATION_POLICY } from "@/lib/content/global";

export function CancellationPolicy() {
  return (
    <div>
      <Heading level={2}>Cancellation policy</Heading>
      <Text>{STANDARD_CANCELLATION_POLICY}</Text>
    </div>
  );
}
