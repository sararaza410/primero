module SearchFilters
  class NumericRange < SearchFilter
    attr_accessor :field_name, :from, :to

    def query_scope(sunspot)
      this = self
      sunspot.instance_eval do
        if this.to.blank?
          with(this.field_name).greater_than_or_equal_to(this.from)
        else
          with(this.field_name, this.from...this.to)
        end
      end
    end

    def to_h
      {
          type: 'numeric_range',
          field_name: self.field_name,
          value: {
              from: self.from,
              to: self.to
          }
      }
    end

  end
end