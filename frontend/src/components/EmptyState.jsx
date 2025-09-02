import { Box, Heading, Text } from '@chakra-ui/react'

export default function EmptyState({ title = 'Nothing here yet', description = 'Try creating something to get started.' }) {
  return (
    <Box borderWidth="1px" borderRadius="md" p={8} textAlign="center" bg="gray.50">
      <Heading size="md" mb={2}>{title}</Heading>
      <Text color="gray.600">{description}</Text>
    </Box>
  )
}


