import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

export default function TourNotFound() {
  return (
    <Container>
      <Heading level={1}>Tour not found</Heading>
      <Text>
        This tour doesn&apos;t exist or is no longer offered. Browse all tours from the menu above.
      </Text>
    </Container>
  );
}
